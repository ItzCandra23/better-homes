import { DimensionId } from "bdsx/bds/actor";
import { BlockPos, Vec3 } from "bdsx/bds/blockpos";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { ServerPlayer } from "bdsx/bds/player";
import { command } from "bdsx/command";
import { events } from "bdsx/event";
import { writeFile } from "fs";

interface player_home {
    homes: {
        name: string[],
        pos: BlockPos[],
        dimension: DimensionId[]
    }
}

let config: {
    normal_max_homes: number,
    admin_max_homes: number,
} = {
    "normal_max_homes": 5,
    "admin_max_homes": 10
};
let db: { [name: string]: player_home } = {};

try { config = require(__dirname + "../../../config.json") } catch(e) { console.log(`[Better-Homes] config.json not found!`) }
try { db = require(__dirname + "../../../homes.json") } catch(e) { console.log(`[Better-Homes] homes.json not found!`) }

export function dimensionIdToString(dimension: DimensionId): string {
    if (dimension === DimensionId.Overworld) return "Overworld";
    if (dimension === DimensionId.Nether) return "Nether";
    if (dimension === DimensionId.TheEnd) return "TheEnd";
    return "Undfined";
}

export function blockPosToVec3(blockpos: BlockPos): Vec3 {
    return Vec3.create(blockpos.x, blockpos.y, blockpos.z);
}

export class HomeAPI {
    /**home. */
    static home() {
        return db;
    }
    /**Add player data. */
    static addPlayer(player: ServerPlayer): boolean {
        if (db.hasOwnProperty(player.getName())) return false;

        db[player.getName()] = {
            "homes": {
                "name": [],
                "pos": [],
                "dimension": []
            },
        }
        return true;
    }
    /**Add player home. */
    static addHome(player: ServerPlayer, name: string, pos: BlockPos, dimension: DimensionId, actor?: ServerPlayer): boolean {
        this.addPlayer(player);
        const data = db[player.getName()];

        if (name === ""||name.includes("§")||name.includes(",")||name.includes(" ")||name.includes(".")) {
            actor?.sendMessage(`§cInvalid name.`);
            return false;
        }
        if (data.homes.name.includes(name)) {
            actor?.sendMessage(`§6${name}§r §calready!`);
            return false;
        }
        if (name.length > 16) {
            actor?.sendMessage(`§6${name}§r §cis too long.`);
            return false;
        }
        if (player.getCommandPermissionLevel() < CommandPermissionLevel.Operator) {
            if (data.homes.name.length+1 > config.normal_max_homes) {
                actor?.sendMessage(`§cCannot exceed the maximum limit.`);
                return false;
            }
        }
        if (player.getCommandPermissionLevel() > CommandPermissionLevel.Normal) {
            if (data.homes.name.length+1 > config.admin_max_homes) {
                actor?.sendMessage(`§cCannot exceed the maximum limit.`);
                return false;
            }
        }

        data.homes.name.push(name);
        data.homes.pos.push(pos);
        data.homes.dimension.push(dimension);
        actor?.sendMessage(`§aAdded House§8[§a${name}§r§7, [§e${pos.x} ${pos.y} ${pos.z}§7], §d${dimensionIdToString(dimension)}§8]`);
        return true;
    }
    /**Remove player home. */
    static removeHome(player: ServerPlayer, name: string, actor?: ServerPlayer): boolean {
        this.addPlayer(player);
        const data = db[player.getName()];

        if (name === "") {
            actor?.sendMessage(`§cInvalid name.`);
            return false;
        }
        if (data.homes.name.includes(name) === false) {
            actor?.sendMessage(`§6${name}§r §cnot found.`);
            return false;
        }

        const index = data.homes.name.indexOf(name);
        actor?.sendMessage(`§aRemoved House§8[§a${name}§r§7, [§e${data.homes.pos[index].x} ${data.homes.pos[index].y} ${data.homes.pos[index].z}§7], §d${dimensionIdToString(data.homes.dimension[index])}§8]`);
        data.homes.dimension = data.homes.dimension.filter((v, i) => { return i !== index });
        data.homes.pos = data.homes.pos.filter((v, i) => { return i !== index });
        data.homes.name = data.homes.name.filter((v, i) => { return i !== index });
        return true;
    }
    /**List player homes. */
    static listHome(player: ServerPlayer, actor?: ServerPlayer): string[] {
        this.addPlayer(player);
        const data = db[player.getName()];

        if (data.homes.name.length === 0) {
            actor?.sendMessage(`§cNot have Homes.`);
            return data.homes.name;
        }

        actor?.sendMessage(`§aHomes: §5[§r ${data.homes.name.toString().replace(/,/g, "§r§7, §r")} §r§5]`);
        return data.homes.name;
    }
    /**Check player home position. */
    static checkHome(player: ServerPlayer, name: string): boolean {
        this.addPlayer(player);
        const data = db[player.getName()];

        if (data.homes.name.includes(name) === false) {
            player?.sendMessage(`§6${name} §r§cnot found!`);
            return false;
        }

        const index = data.homes.name.indexOf(name);
        player.sendMessage(`§l§5+--x§aCheckHome§5x--+§r`+`\n  §aname: §e${name}§r`+`\n  §aposition: §7[§b${data.homes.pos[index].x}, ${data.homes.pos[index].y}, ${data.homes.pos[index].z}§7]§r`+`\n  §adimmension: ${dimensionIdToString(data.homes.dimension[index])}`);
        return true;
    }
    /**Teleport player to home. */
    static teleport(player: ServerPlayer, name: string, actor?: ServerPlayer): boolean {
        this.addPlayer(player);
        const data = db[player.getName()];

        if (data.homes.name.includes(name) === false) {
            actor?.sendMessage(`§6${name} §r§cnot found!`);
            return false;
        }
        if (data.homes.pos[data.homes.name.indexOf(name)] === undefined) {
            actor?.sendMessage(`§cPosition not found!`);
            return false;
        }
        if (data.homes.dimension[data.homes.name.indexOf(name)] === undefined) {
            actor?.sendMessage(`§cDimension not found!`);
            return false;
        }

        const index = data.homes.name.indexOf(name);
        const pos = data.homes.pos[index];
        player.teleport(Vec3.create(pos.x+0.5, pos.y+0.5, pos.z+0.5), data.homes.dimension[index]);
        actor?.sendMessage(`§aTeleport to §6${name}`);
        return true;
    }
    /**Change max homes. */
    static setMaxHomes(max: number, actor?: ServerPlayer): boolean {
        if (max < 1||config.normal_max_homes === max) {
            actor?.sendMessage(`§cInvalid number!`);
            return false;
        }

        config.normal_max_homes=max;
        actor?.sendMessage(`§aChange max homes to §e${max}`);
        return true;
    }
    /**Change admin max homes. */
    static setAdminMaxHomes(max: number, actor?: ServerPlayer): boolean {
        if (max < 1||config.admin_max_homes === max) {
            actor?.sendMessage(`§cInvalid number!`);
            return false;
        }

        config.admin_max_homes=max;
        actor?.sendMessage(`§aChange admin max homes to §e${max}`);
        return true;
    }
    /**WriteFile. */
    static writeFile(): void {
        writeFile(__dirname + "../../../config.json", JSON.stringify(config), (err) => {
            if (err) {
                console.log(`[Better-Homes] config.json Error: \n${err}`);
            } else {
                console.log(`[Better-Homes] config.json Saved!`);
            }
        });
        writeFile(__dirname + "../../../homes.json", JSON.stringify(db), (err) => {
            if (err) {
                console.log(`[Better-Homes] homes.json Error: \n${err}`);
            } else {
                console.log(`[Better-Homes] homes.json Saved!`);
            }
        });
    }
    /**WriteFileNoMessage. */
    static writeFileNoMessage(): void {
        writeFile(__dirname + "../../../config.json", JSON.stringify(config), () => {});
        writeFile(__dirname + "../../../homes.json", JSON.stringify(db), () => {});
    }
}

events.serverOpen.on(() => {
    command.register("save_home", "", CommandPermissionLevel.Host).overload(() => {HomeAPI.writeFile()}, {});
});

events.playerJoin.on((ev) => {HomeAPI.addPlayer(ev.player)} );

events.serverStop.on(() => {HomeAPI.writeFile()} );