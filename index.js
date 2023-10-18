"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeMain = void 0;
const event_1 = require("bdsx/event");
const blockpos_1 = require("bdsx/bds/blockpos");
const message_1 = require("./src/utils/message");
const path = require("path");
const fs = require("fs");
const teleporting = new Map();
let config = {
    timeout: 3,
    home_limit: 5,
};
let homes = {};
const configPath = path.join(__dirname, "config.json");
const homePath = path.join(__dirname, "homes.json");
try {
    config = require(configPath);
    homes = require(homePath);
}
catch (err) { }
/**HomeMain */
var HomeMain;
(function (HomeMain) {
    /**Set Teleport Timeout */
    async function setTeleportTimeout(value) {
        return new Promise((resolve, reject) => {
            if (!(value >= 0)) {
                reject("Invalid value!");
                return;
            }
            config.timeout = value;
            resolve();
        });
    }
    HomeMain.setTeleportTimeout = setTeleportTimeout;
    /**Get Teleport Timeout */
    function getTeleportTimeout() {
        if (!config.timeout)
            return undefined;
        if (config.timeout < 0 || config.timeout === 0)
            return undefined;
        return config.timeout;
    }
    HomeMain.getTeleportTimeout = getTeleportTimeout;
    /**Set Default Limit */
    async function setDefaultLimit(value) {
        return new Promise((resolve, reject) => {
            if (!(value >= 0)) {
                reject("Invalid value!");
                return;
            }
            config.home_limit = value;
            resolve();
        });
    }
    HomeMain.setDefaultLimit = setDefaultLimit;
    /**Get Default Home Limit */
    function getDefaultLimit() {
        if (config.home_limit < 0)
            return 0;
        else
            return config.home_limit;
    }
    HomeMain.getDefaultLimit = getDefaultLimit;
    /**Set Max Limit */
    // export async function setMaxLimit(value: number): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         if (!(value >= 0)) {
    //             reject("Invalid value!");
    //             return;
    //         }
    //         config.max_home_limit=value;
    //         resolve();
    //     });
    // }
    // /**Get Max Home Limit */
    // export function getMaxLimit(): number {
    //     if (config.max_home_limit < 0) return 0;
    //     else return config.max_home_limit;
    // }
    /**Set Player Homes Limit */
    async function setHomesLimit(player, value) {
        return new Promise((resolve, reject) => {
            if (!hasPlayer(player)) {
                reject("Xuid not found!");
                return;
            }
            if (value < 0) {
                reject("Invalid value!");
                return;
            }
            homes[player.getXuid()].limit = value;
            resolve();
        });
    }
    HomeMain.setHomesLimit = setHomesLimit;
    /**Remove Player Homes Limit */
    async function removeHomesLimit(player, value) {
        return new Promise((resolve, reject) => {
            if (!hasPlayer(player)) {
                reject("Xuid not found!");
                return;
            }
            if (value < 0 || (getHomesLimit(player) - value) < 0) {
                reject("Invalid value!");
                return;
            }
            homes[player.getXuid()].limit -= value;
            resolve();
        });
    }
    HomeMain.removeHomesLimit = removeHomesLimit;
    /**Set Player Homes Limit */
    async function addHomesLimit(player, value) {
        return new Promise((resolve, reject) => {
            if (!hasPlayer(player)) {
                reject("Xuid not found!");
                return;
            }
            if (value < 0) {
                reject("Invalid value!");
                return;
            }
            homes[player.getXuid()].limit += value;
            resolve();
        });
    }
    HomeMain.addHomesLimit = addHomesLimit;
    /**Get Player Homes Limit */
    function getHomesLimit(player) {
        if (!hasPlayer(player))
            return 0;
        else
            return homes[player.getXuid()].limit;
    }
    HomeMain.getHomesLimit = getHomesLimit;
    /**Check Has Player */
    function hasPlayer(player) {
        return homes.hasOwnProperty(player.getXuid());
    }
    HomeMain.hasPlayer = hasPlayer;
    /**Add Player Data */
    function addPlayer(player) {
        const xuid = player.getXuid();
        if (xuid === "")
            return false;
        if (hasPlayer(player))
            return false;
        homes[xuid] = {
            limit: getDefaultLimit(),
            homes: [],
        };
        return true;
    }
    HomeMain.addPlayer = addPlayer;
    /**Has Player Home */
    function hasHome(player, name) {
        if (!hasPlayer(player))
            return false;
        else
            return Boolean(homes[player.getXuid()].homes.find((home) => home.name === name));
    }
    HomeMain.hasHome = hasHome;
    /**Get Player Home */
    function getHome(player, name) {
        var _a;
        if (!hasPlayer(player))
            return null;
        else
            return (_a = homes[player.getXuid()].homes.find((home) => home.name === name)) !== null && _a !== void 0 ? _a : null;
    }
    HomeMain.getHome = getHome;
    /**Get All Player Homes */
    function getHomes(player) {
        if (!hasPlayer(player))
            return null;
        else
            return homes[player.getXuid()].homes;
    }
    HomeMain.getHomes = getHomes;
    /**Get All Player Homes Name */
    function getHomesName(player) {
        if (!hasPlayer(player))
            return null;
        else
            return homes[player.getXuid()].homes.map((home) => home.name);
    }
    HomeMain.getHomesName = getHomesName;
    /**Create New Home */
    async function createHome(player, name, pos = blockpos_1.BlockPos.create(player.getFeetPos()), dimensionId = player.getDimensionId()) {
        return new Promise((resolve, reject) => {
            var _a, _b, _c;
            addPlayer(player);
            const xuid = player.getXuid();
            if (xuid === "") {
                reject("Xuid not found!");
                return;
            }
            const amount = (_b = (_a = getHomes(player)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            const limit = (_c = getHomesLimit(player)) !== null && _c !== void 0 ? _c : 0;
            const textPattern = /^[A-Za-z0-9]+$/;
            if (!limit && (amount + 1) > limit) {
                reject("Maximum homes limit");
                return;
            }
            if ((amount + 1) > limit) {
                reject("Maximum homes limit");
                return;
            }
            if (!textPattern.test(name)) {
                reject("Invalid name!");
                return;
            }
            if (hasHome(player, name)) {
                player.sendMessage(`§cHome already`);
                return;
            }
            const home = {
                name: name,
                pos: pos,
                dimension: dimensionId,
            };
            homes[xuid].homes.push(home);
            resolve(home);
        });
    }
    HomeMain.createHome = createHome;
    /**Delete Player Home */
    async function deleteHome(player, name) {
        return new Promise((resolve, reject) => {
            addPlayer(player);
            const xuid = player.getXuid();
            if (xuid === "") {
                reject("Xuid not found!");
                return;
            }
            const home = getHome(player, name);
            if (!home) {
                reject("Home not found!");
                return;
            }
            homes[xuid].homes = homes[xuid].homes.filter((data) => data.name !== name);
            resolve(home);
        });
    }
    HomeMain.deleteHome = deleteHome;
    /**Set Player Home */
    async function setHome(player, name, pos = blockpos_1.BlockPos.create(player.getFeetPos()), dimensionId = player.getDimensionId()) {
        return new Promise((resolve, reject) => {
            var _a, _b, _c;
            addPlayer(player);
            const xuid = player.getXuid();
            if (xuid === "") {
                reject("Xuid not found!");
                return;
            }
            if (hasHome(player, name)) {
                const home = {
                    name: name,
                    pos: pos,
                    dimension: dimensionId,
                };
                homes[xuid].homes.push(home);
                resolve(home);
                return;
            }
            const amount = (_b = (_a = getHomes(player)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            const limit = (_c = getHomesLimit(player)) !== null && _c !== void 0 ? _c : 0;
            const textPattern = /^[A-Za-z0-9]+$/;
            if (!limit && (amount + 1) > limit) {
                reject("Maximum homes limit");
                return;
            }
            if ((amount + 1) > limit) {
                reject("Maximum homes limit");
                return;
            }
            if (!textPattern.test(name)) {
                reject("Invalid name!");
                return;
            }
            const home = {
                name: name,
                pos: pos,
                dimension: dimensionId,
            };
            homes[xuid].homes.push(home);
            resolve(home);
        });
    }
    HomeMain.setHome = setHome;
    /**Teleport Player */
    function teleport(player, home) {
        if (player.getXuid() === "") {
            player.sendMessage(`§cXuid not found!`);
            return false;
        }
        const data = getHome(player, home);
        if (!data) {
            player.sendMessage(`§cHome not found!`);
            return false;
        }
        const pos = data.pos;
        const posFix = blockpos_1.Vec3.create(Math.floor(pos.x) + 0.5, Math.floor(pos.y) + 0.5, Math.floor(pos.z) + 0.5);
        const timeout = getTeleportTimeout();
        if (timeout) {
            player.sendMessage(`§aTeleporting to §r${data.name} Home§a in §r${timeout}§a seaconds`);
            teleporting.set(player.getNetworkIdentifier(), player);
            const wait = setTimeout(() => {
                if (teleporting.has(player.getNetworkIdentifier())) {
                    teleporting.delete(player.getNetworkIdentifier());
                    player.teleport(posFix);
                    player.sendMessage(`§aTeleported!`);
                }
            }, timeout * 1000);
            event_1.events.playerLeft.on((ev) => {
                if (ev.player === player)
                    clearTimeout(wait);
            });
            return true;
        }
        player.sendMessage(`§aTeleporting to §r${data.name} Home`);
        player.teleport(posFix);
        player.sendMessage(`§aTeleported!`);
        return true;
    }
    HomeMain.teleport = teleport;
    function save(message = false) {
        fs.writeFile(configPath, JSON.stringify(config, null, 4), "utf8", (err) => {
            if (message) {
                if (err)
                    message_1.send.error(`config.json ${err}`);
                else
                    message_1.send.success(`config.json Saved!`);
            }
        });
        fs.writeFile(homePath, JSON.stringify(homes, null, 4), "utf8", (err) => {
            if (message) {
                if (err)
                    message_1.send.error(`homes.json ${err}`);
                else
                    message_1.send.success(`homes.json Saved!`);
            }
        });
    }
    HomeMain.save = save;
})(HomeMain || (exports.HomeMain = HomeMain = {}));
const movingCanceling = setInterval(() => {
    const players = Array.from(teleporting.entries());
    for (let i = 0; i < players.length; i++) {
        const [netId, player] = players[i];
        if (!player.isMoving())
            return;
        teleporting.delete(netId);
        player.sendMessage(`§cTeleport §4Cancelled!`);
    }
}, 1);
event_1.events.playerLeft.on((data) => {
    if (teleporting.has(data.player.getNetworkIdentifier()))
        teleporting.delete(data.player.getNetworkIdentifier());
});
event_1.events.serverStop.on(() => {
    clearInterval(movingCanceling);
});
event_1.events.playerJoin.on((ev) => {
    HomeMain.addPlayer(ev.player);
});
event_1.events.serverOpen.on(() => {
    require("./src");
    require("./src/form");
    message_1.send.success(`Started!`);
});
event_1.events.serverClose.on(() => {
    HomeMain.save(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBb0M7QUFDcEMsZ0RBQW1EO0FBSW5ELGlEQUEyQztBQUMzQyw2QkFBNkI7QUFDN0IseUJBQXlCO0FBYXpCLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxFQUE2QixDQUFDO0FBRXpELElBQUksTUFBTSxHQUdOO0lBQ0EsT0FBTyxFQUFFLENBQUM7SUFDVixVQUFVLEVBQUUsQ0FBQztDQUNoQixDQUFDO0FBQ0YsSUFBSSxLQUFLLEdBQStCLEVBQUUsQ0FBQztBQUUzQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN2RCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUVwRCxJQUFJO0lBQ0EsTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QixLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQzdCO0FBQUMsT0FBTSxHQUFHLEVBQUUsR0FBRTtBQUVmLGNBQWM7QUFDZCxJQUFpQixRQUFRLENBd1V4QjtBQXhVRCxXQUFpQixRQUFRO0lBRXJCLDBCQUEwQjtJQUNuQixLQUFLLFVBQVUsa0JBQWtCLENBQUMsS0FBYTtRQUNsRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDZixNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDekIsT0FBTzthQUNWO1lBRUQsTUFBTSxDQUFDLE9BQU8sR0FBQyxLQUFLLENBQUM7WUFDckIsT0FBTyxFQUFFLENBQUE7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFWcUIs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