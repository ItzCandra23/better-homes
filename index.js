"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeMain = void 0;
const event_1 = require("bdsx/event");
const blockpos_1 = require("bdsx/bds/blockpos");
const actor_1 = require("bdsx/bds/actor");
const message_1 = require("./src/utils/message");
const path = require("path");
const fs = require("fs");
const src_1 = require("./src");
const homePath = path.join(__dirname, "homes.json");
let homes = {};
try {
    homes = require(homePath);
}
catch (err) { }
var HomeMain;
(function (HomeMain) {
    function teleport(player, home) {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") {
            player.sendMessage(`§cXuid not found!`);
            return false;
        }
        const data = getHome(player, home);
        if (!data) {
            player.sendMessage(`§cHome not found!`);
            return false;
        }
        player.sendMessage(`§aTeleport to §r${home}`);
        player.teleport(blockpos_1.Vec3.create(data.pos.x + 0.5, data.pos.y + 0.5, data.pos.z + 0.5), data.dimension);
        return true;
    }
    HomeMain.teleport = teleport;
    function addPlayer(player) {
        const xuid = player.getXuid();
        if (xuid === "")
            return false;
        if (homes.hasOwnProperty(xuid))
            return false;
        homes[xuid] = [];
        return true;
    }
    HomeMain.addPlayer = addPlayer;
    function createHome(player, name, pos = player.getPosition().floor(), dimensionId = player.getDimensionId()) {
        var _a, _b;
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") {
            player.sendMessage(`§cXuid not found!`);
            return false;
        }
        const amount = (_a = getHomesAmount(player)) !== null && _a !== void 0 ? _a : 0;
        const limit = (_b = src_1.PlayerHomeLimite.getHomeLimits(player)) !== null && _b !== void 0 ? _b : 0;
        if (!limit && (amount + 1) > limit) {
            player.sendMessage(`§cExceed the limit`);
            return false;
        }
        if (homes[xuid].find((v) => name === v.name)) {
            player.sendMessage(`§cHome already`);
            return false;
        }
        const floor = pos.floor();
        player.sendMessage(`§aAdded §8[§r${name}§r, §7[§rx: ${floor.x}, y: ${floor.y}, z: ${floor.z}§7]§r ${actor_1.DimensionId[dimensionId]}§8]`);
        homes[xuid].push({
            name: name,
            pos: pos.floor(),
            dimension: dimensionId,
        });
        return true;
    }
    HomeMain.createHome = createHome;
    function deleteHome(player, name) {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") {
            player.sendMessage(`§cXuid not found!`);
            return false;
        }
        const home = homes[xuid].find((v) => name === v.name);
        if (!home) {
            player.sendMessage(`§cHome not found!`);
            return false;
        }
        player.sendMessage(`§aRemoved §8[§r${name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${actor_1.DimensionId[home.dimension]}§8]`);
        homes[xuid] = homes[xuid].filter((v) => name !== v.name);
        return true;
    }
    HomeMain.deleteHome = deleteHome;
    function getHomes(player) {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return null;
        return homes[xuid];
    }
    HomeMain.getHomes = getHomes;
    function getHomesName(player) {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return [];
        let playerHomes = [];
        homes[xuid].forEach((v) => {
            playerHomes.push(v.name);
        });
        return playerHomes;
    }
    HomeMain.getHomesName = getHomesName;
    function getHome(player, name) {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return null;
        const home = homes[xuid].find((v) => name === v.name);
        if (!home)
            return null;
        return home;
    }
    HomeMain.getHome = getHome;
    function getHomesAmount(player) {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return null;
        return homes[xuid].length;
    }
    HomeMain.getHomesAmount = getHomesAmount;
    function has(player, name) {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return false;
        const home = homes[xuid].find((v) => name === v.name);
        if (!home)
            return false;
        return homes[xuid].includes(home);
    }
    HomeMain.has = has;
    function save(message = false) {
        fs.writeFile(homePath, JSON.stringify(homes, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    message_1.send.error(`homes.json ${err}`);
                    throw err;
                }
                else
                    message_1.send.success(`homes.json Saved!`);
            }
        });
    }
    HomeMain.save = save;
})(HomeMain = exports.HomeMain || (exports.HomeMain = {}));
event_1.events.playerJoin.on((ev) => { HomeMain.addPlayer(ev.player); });
event_1.events.serverOpen.on(() => {
    require("./src");
    require("./src/commands");
    message_1.send.success(`Started!`);
});
event_1.events.serverClose.on(() => {
    HomeMain.save(true);
    src_1.PlayerHomeLimite.save(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBb0M7QUFDcEMsZ0RBQXlDO0FBQ3pDLDBDQUE2QztBQUU3QyxpREFBMkM7QUFDM0MsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUN6QiwrQkFBeUM7QUFRekMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDcEQsSUFBSSxLQUFLLEdBQWlDLEVBQUUsQ0FBQztBQUU3QyxJQUFJO0lBQUUsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtDQUFFO0FBQUMsT0FBTSxHQUFHLEVBQUUsR0FBRTtBQUUvQyxJQUFpQixRQUFRLENBa0l4QjtBQWxJRCxXQUFpQixRQUFRO0lBRXJCLFNBQWdCLFFBQVEsQ0FBQyxNQUFvQixFQUFFLElBQVk7UUFDdkQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7WUFDYixNQUFNLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDeEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxNQUFNLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDeEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDLG1CQUFtQixJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxH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