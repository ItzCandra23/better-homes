"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeAPI = exports.blockPosToVec3 = exports.dimensionIdToString = void 0;
const actor_1 = require("bdsx/bds/actor");
const blockpos_1 = require("bdsx/bds/blockpos");
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const event_1 = require("bdsx/event");
const fs_1 = require("fs");
let config = {
    "normal_max_homes": 5,
    "admin_max_homes": 10
};
let db = {};
try {
    config = require(__dirname + "../../../config.json");
}
catch (e) {
    console.log(`[Better-Homes] config.json not found!`);
}
try {
    db = require(__dirname + "../../../homes.json");
}
catch (e) {
    console.log(`[Better-Homes] homes.json not found!`);
}
function dimensionIdToString(dimension) {
    if (dimension === actor_1.DimensionId.Overworld)
        return "Overworld";
    if (dimension === actor_1.DimensionId.Nether)
        return "Nether";
    if (dimension === actor_1.DimensionId.TheEnd)
        return "TheEnd";
    return "Undfined";
}
exports.dimensionIdToString = dimensionIdToString;
function blockPosToVec3(blockpos) {
    return blockpos_1.Vec3.create(blockpos.x, blockpos.y, blockpos.z);
}
exports.blockPosToVec3 = blockPosToVec3;
class HomeAPI {
    /**home. */
    static home() {
        return db;
    }
    /**Add player data. */
    static addPlayer(player) {
        if (db.hasOwnProperty(player.getName()))
            return false;
        db[player.getName()] = {
            "player": player,
            "homes": {
                "name": [],
                "pos": [],
                "dimension": []
            },
        };
        return true;
    }
    /**Add player home. */
    static addHome(player, name, pos, dimension, actor) {
        this.addPlayer(player);
        const data = db[player.getName()];
        if (name === "") {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§cInvalid name.`);
            return false;
        }
        if (data.homes.name.includes(name)) {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§6${name}§r §calready!`);
            return false;
        }
        if (name.length > 16) {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§6${name}§r §cis too long.`);
            return false;
        }
        if (player.getCommandPermissionLevel() < command_1.CommandPermissionLevel.Operator) {
            if (data.homes.name.length + 1 > config.normal_max_homes) {
                actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§cCannot exceed the maximum limit.`);
                return false;
            }
        }
        if (player.getCommandPermissionLevel() > command_1.CommandPermissionLevel.Normal) {
            if (data.homes.name.length + 1 > config.admin_max_homes) {
                actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§cCannot exceed the maximum limit.`);
                return false;
            }
        }
        data.homes.name.push(name);
        data.homes.pos.push(pos);
        data.homes.dimension.push(dimension);
        actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§aAdded House§8[§a${name}§r§7, [§e${pos.x} ${pos.y} ${pos.z}§7], §d${dimensionIdToString(dimension)}§8]`);
        return true;
    }
    /**Remove player home. */
    static removeHome(player, name, actor) {
        this.addPlayer(player);
        const data = db[player.getName()];
        if (name === "") {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§cInvalid name.`);
            return false;
        }
        if (data.homes.name.includes(name) === false) {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§6${name}§r §cnot found.`);
            return false;
        }
        const index = data.homes.name.indexOf(name);
        actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§aRemoved House§8[§a${name}§r§7, [§e${data.homes.pos[index].x} ${data.homes.pos[index].y} ${data.homes.pos[index].z}§7], §d${dimensionIdToString(data.homes.dimension[index])}§8]`);
        data.homes.dimension = data.homes.dimension.filter((v, i) => { return i !== index; });
        data.homes.pos = data.homes.pos.filter((v, i) => { return i !== index; });
        data.homes.name = data.homes.name.filter((v, i) => { return i !== index; });
        return true;
    }
    /**List player homes. */
    static listHome(player, actor) {
        this.addPlayer(player);
        const data = db[player.getName()];
        if (data.homes.name.length === 0) {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§cNot have Homes.`);
            return data.homes.name;
        }
        actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§aHomes: §r${data.homes.name}§r.`);
        return data.homes.name;
    }
    /**Check player home position. */
    static checkHome(player, name) {
        this.addPlayer(player);
        const data = db[player.getName()];
        if (data.homes.name.includes(name) === false) {
            player === null || player === void 0 ? void 0 : player.sendMessage(`§6${name} §r§cnot found!`);
            return false;
        }
        const index = data.homes.name.indexOf(name);
        player.sendMessage(`§l§5+--x§aCheckHome§5x--+§r` + `\n  §aname: §e${name}§r` + `\n  §aposition: §7[§b${data.homes.pos[index].x}, ${data.homes.pos[index].y}, ${data.homes.pos[index].z}§7]§r` + `\n  §adimmension: ${dimensionIdToString(data.homes.dimension[index])}`);
        return true;
    }
    /**Teleport player to home. */
    static teleport(player, name, actor) {
        this.addPlayer(player);
        const data = db[player.getName()];
        if (data.homes.name.includes(name) === false) {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§6${name} §r§cnot found!`);
            return false;
        }
        if (data.homes.pos[data.homes.name.indexOf(name)] === undefined) {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§cPosition not found!`);
            return false;
        }
        if (data.homes.dimension[data.homes.name.indexOf(name)] === undefined) {
            actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§cDimension not found!`);
            return false;
        }
        const index = data.homes.name.indexOf(name);
        const pos = data.homes.pos[index];
        player.teleport(blockpos_1.Vec3.create(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5), data.homes.dimension[index]);
        actor === null || actor === void 0 ? void 0 : actor.sendMessage(`§aTeleport to §6${name}`);
        return true;
    }
    /**WriteFile. */
    static writeFile() {
        (0, fs_1.writeFile)(__dirname + "../../../config.json", JSON.stringify(config), (err) => {
            if (err) {
                console.log(`[Better-Homes] config.json Error: \n${err}`);
            }
            else {
                console.log(`[Better-Homes] config.json Saved!`);
            }
        });
        (0, fs_1.writeFile)(__dirname + "../../../homes.json", JSON.stringify(db), (err) => {
            if (err) {
                console.log(`[Better-Homes] homes.json Error: \n${err}`);
            }
            else {
                console.log(`[Better-Homes] homes.json Saved!`);
            }
        });
    }
}
exports.HomeAPI = HomeAPI;
event_1.events.serverOpen.on(() => {
    command_2.command.register("save_home", "", command_1.CommandPermissionLevel.Host)
        .overload(() => {
        HomeAPI.writeFile();
    }, {});
});
event_1.events.playerJoin.on((ev) => {
    HomeAPI.addPlayer(ev.player);
});
event_1.events.serverStop.on(() => {
    HomeAPI.writeFile();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBNkM7QUFDN0MsZ0RBQW1EO0FBQ25ELDhDQUEwRDtBQUUxRCwwQ0FBdUM7QUFDdkMsc0NBQW9DO0FBQ3BDLDJCQUErQjtBQVcvQixJQUFJLE1BQU0sR0FBRztJQUNULGtCQUFrQixFQUFFLENBQUM7SUFDckIsaUJBQWlCLEVBQUUsRUFBRTtDQUN4QixDQUFDO0FBQ0YsSUFBSSxFQUFFLEdBQW9DLEVBQUUsQ0FBQztBQUU3QyxJQUFJO0lBQUUsTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLENBQUMsQ0FBQTtDQUFFO0FBQUMsT0FBTSxDQUFDLEVBQUU7SUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDLENBQUE7Q0FBRTtBQUM5SCxJQUFJO0lBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsQ0FBQTtDQUFFO0FBQUMsT0FBTSxDQUFDLEVBQUU7SUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7Q0FBRTtBQUV4SCxTQUFnQixtQkFBbUIsQ0FBQyxTQUFzQjtJQUN0RCxJQUFJLFNBQVMsS0FBSyxtQkFBVyxDQUFDLFNBQVM7UUFBRSxPQUFPLFdBQVcsQ0FBQztJQUM1RCxJQUFJLFNBQVMsS0FBSyxtQkFBVyxDQUFDLE1BQU07UUFBRSxPQUFPLFFBQVEsQ0FBQztJQUN0RCxJQUFJLFNBQVMsS0FBSyxtQkFBVyxDQUFDLE1BQU07UUFBRSxPQUFPLFFBQVEsQ0FBQztJQUN0RCxPQUFPLFVBQVUsQ0FBQztBQUN0QixDQUFDO0FBTEQsa0RBS0M7QUFFRCxTQUFnQixjQUFjLENBQUMsUUFBa0I7SUFDN0MsT0FBTyxlQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUZELHdDQUVDO0FBRUQsTUFBYSxPQUFPO0lBQ2hCLFdBQVc7SUFDWCxNQUFNLENBQUMsSUFBSTtRQUNQLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUNELHNCQUFzQjtJQUN0QixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQW9CO1FBQ2pDLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUV0RCxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUc7WUFDbkIsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFO2dCQUNMLE1BQU0sRUFBRSxFQUFFO2dCQUNWLEtBQUssRUFBRSxFQUFFO2dCQUNULFdBQVcsRUFBRSxFQUFFO2FBQ2xCO1NBQ0osQ0FBQTtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFvQixFQUFFLElBQVksRUFBRSxHQUFhLEVBQUUsU0FBc0IsRUFBRSxLQUFvQjtRQUMxRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVsQyxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7WUFDYixLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxDQUFDLEtBQUssSUFBSSxlQUFlLENBQUMsQ0FBQztZQUM3QyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7WUFDbEIsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFdBQVcsQ0FBQyxLQUFLLElBQUksbUJBQW1CLENBQUMsQ0FBQztZQUNqRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksTUFBTSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsZ0NBQXNCLENBQUMsUUFBUSxFQUFFO1lBQ3RFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3BELEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLENBQUMsb0NBQW9DLENBQUMsQ0FBQztnQkFDekQsT0FBTyxLQUFLLENBQUM7YUFDaEI7U0FDSjtRQUNELElBQUksTUFBTSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsZ0NBQXNCLENBQUMsTUFBTSxFQUFFO1lBQ3BFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFO2dCQUNuRCxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7Z0JBQ3pELE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxDQUFDLHFCQUFxQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlILE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCx5QkFBeUI7SUFDekIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFvQixFQUFFLElBQVksRUFBRSxLQUFvQjtRQUN0RSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVsQyxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7WUFDYixLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDMUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFdBQVcsQ0FBQyxLQUFLLElBQUksaUJBQWlCLENBQUMsQ0FBQztZQUMvQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxDQUFDLHVCQUF1QixJQUFJLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeE0sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELHdCQUF3QjtJQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQW9CLEVBQUUsS0FBb0I7UUFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlCLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUN4QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQzFCO1FBRUQsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFdBQVcsQ0FBQyxjQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFDRCxpQ0FBaUM7SUFDakMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFvQixFQUFFLElBQVk7UUFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQzFDLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxXQUFXLENBQUMsS0FBSyxJQUFJLGlCQUFpQixDQUFDLENBQUM7WUFDaEQsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyw2QkFBNkIsR0FBQyxpQkFBaUIsSUFBSSxJQUFJLEdBQUMsd0JBQXdCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMscUJBQXFCLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25RLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCw4QkFBOEI7SUFDOUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFvQixFQUFFLElBQVksRUFBRSxLQUFvQjtRQUNwRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVsQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDMUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFdBQVcsQ0FBQyxLQUFLLElBQUksaUJBQWlCLENBQUMsQ0FBQztZQUMvQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQzdELEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUM1QyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ25FLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUM3QyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzNGLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLENBQUMsbUJBQW1CLElBQUksRUFBRSxDQUFDLENBQUM7UUFDOUMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELGdCQUFnQjtJQUNoQixNQUFNLENBQUMsU0FBUztRQUNaLElBQUEsY0FBUyxFQUFDLFNBQVMsR0FBRyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDMUUsSUFBSSxHQUFHLEVBQUU7Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUM3RDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7YUFDcEQ7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUEsY0FBUyxFQUFDLFNBQVMsR0FBRyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDckUsSUFBSSxHQUFHLEVBQUU7Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUM1RDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7YUFDbkQ7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQWhKRCwwQkFnSkM7QUFFRCxjQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7SUFDdEIsaUJBQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRSxnQ0FBc0IsQ0FBQyxJQUFJLENBQUM7U0FDN0QsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNYLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN4QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDWCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakMsQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7SUFDdEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3hCLENBQUMsQ0FBQyxDQUFDIn0=