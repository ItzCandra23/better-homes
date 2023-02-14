import { events } from "bdsx/event";
import { Vec3 } from "bdsx/bds/blockpos";
import { DimensionId } from "bdsx/bds/actor";
import { ServerPlayer } from "bdsx/bds/player";
import { send } from "./src/utils/message";
import * as path from "path";
import * as fs from "fs";
import { PlayerHomeLimite } from "./src";

interface PlayerHome {
    name: string;
    pos: Vec3;
    dimension: DimensionId;
}

const homePath = path.join(__dirname, "homes.json");
let homes: Record<string, PlayerHome[]> = {};

try { homes = require(homePath) } catch(err) {}

export namespace HomeMain {

    export function teleport(player: ServerPlayer, home: string): boolean {
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
        player.teleport(Vec3.create(data.pos.x+0.5, data.pos.y+0.5, data.pos.z+0.5), data.dimension);
        return true;
    }

    export function addPlayer(player: ServerPlayer): boolean {
        const xuid = player.getXuid();
        if (xuid === "") return false;
        if (homes.hasOwnProperty(xuid)) return false;
        homes[xuid]=[];
        return true;
    }

    export function createHome(player: ServerPlayer, name: string, pos: Vec3 = player.getPosition().floor(), dimensionId: DimensionId = player.getDimensionId()): boolean {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") {
            player.sendMessage(`§cXuid not found!`);
            return false;
        }
        const amount = getHomesAmount(player) ?? 0;
        const limit = PlayerHomeLimite.getHomeLimits(player) ?? 0;
        if (!limit && (amount+1) > limit) {
            player.sendMessage(`§cExceed the limit`);
            return false;
        }
        if (homes[xuid].find((v) => name === v.name)) {
            player.sendMessage(`§cHome already`);
            return false;
        }

        const floor = pos.floor();
        player.sendMessage(`§aAdded §8[§r${name}§r, §7[§rx: ${floor.x}, y: ${floor.y}, z: ${floor.z}§7]§r ${DimensionId[dimensionId]}§8]`);
        homes[xuid].push({
            name: name,
            pos: pos.floor(),
            dimension: dimensionId,
        });
        return true;
    }

    export function deleteHome(player: ServerPlayer, name: string): boolean {
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

        player.sendMessage(`§aRemoved §8[§r${name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`);
        homes[xuid]=homes[xuid].filter((v) => name !== v.name);
        return true;
    }

    export function getHomes(player: ServerPlayer): PlayerHome[]|null {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") return null;
        return homes[xuid];
    }

    export function getHomesName(player: ServerPlayer): string[] {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") return [];

        let playerHomes: string[] = [];
        homes[xuid].forEach((v) => {
            playerHomes.push(v.name);
        });

        return playerHomes;
    }

    export function getHome(player: ServerPlayer, name: string): PlayerHome|null {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") return null;
        const home = homes[xuid].find((v) => name === v.name);
        if (!home) return null;
        return home;
    }

    export function getHomesAmount(player: ServerPlayer): number|null {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") return null;
        return homes[xuid].length;
    }

    export function has(player: ServerPlayer, name: string): boolean {
        addPlayer(player);
        const xuid = player.getXuid();
        if (xuid === "") return false;
        const home = homes[xuid].find((v) => name === v.name);
        if (!home) return false;
        return homes[xuid].includes(home);
    }

    export function save(message: boolean = false): void {
        fs.writeFile(homePath, JSON.stringify(homes, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`homes.json ${err}`);
                    throw err;
                }
                else send.success(`homes.json Saved!`);
            }
        });
    }
}

events.playerJoin.on((ev) => {
    HomeMain.addPlayer(ev.player);
    PlayerHomeLimite.addPlayerHomeLimits(ev.player);
});

events.serverOpen.on(() => {
    require("./src");
    require("./src/commands");
    send.success(`Started!`);
});

events.serverClose.on(() => {
    HomeMain.save(true);
    PlayerHomeLimite.save(true);
});
