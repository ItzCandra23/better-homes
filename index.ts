import { events } from "bdsx/event";
import { BlockPos, Vec3 } from "bdsx/bds/blockpos";
import { DimensionId } from "bdsx/bds/actor";
import { Player } from "bdsx/bds/player";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { send } from "./src/utils/message";
import * as path from "path";
import * as fs from "fs";

export interface Home {
    name: string;
    pos: BlockPos;
    dimension: DimensionId;
}

export interface PlayerHome {
    limit: number;
    homes: Home[];
}

const teleporting = new Map<NetworkIdentifier, Player>();

let config: {
    timeout?: number;
    home_limit: number;
} = {
    timeout: 3,
    home_limit: 5,
};
let homes: Record<string, PlayerHome> = {};

const configPath = path.join(__dirname, "config.json");
const homePath = path.join(__dirname, "homes.json");

try {
    config = require(configPath);
    homes = require(homePath);
} catch(err) {}

/**HomeMain */
export namespace HomeMain {

    /**Set Teleport Timeout */
    export async function setTeleportTimeout(value: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!(value >= 0)) {
                reject("Invalid value!");
                return;
            }

            config.timeout=value;
            resolve()
        });
    }

    /**Get Teleport Timeout */
    export function getTeleportTimeout(): number|undefined {
        if (!config.timeout) return undefined;
        if (config.timeout < 0||config.timeout === 0) return undefined;
        return config.timeout;
    }

    /**Set Default Limit */
    export async function setDefaultLimit(value: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!(value >= 0)) {
                reject("Invalid value!");
                return;
            }

            config.home_limit=value;
            resolve();
        });
    }

    /**Get Default Home Limit */
    export function getDefaultLimit(): number {
        if (config.home_limit < 0) return 0;
        else return config.home_limit;
    }

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
    export async function setHomesLimit(player: Player, value: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!hasPlayer(player)) {
                reject("Xuid not found!");
                return;
            }
            if (value < 0) {
                reject("Invalid value!");
                return;
            }

            homes[player.getXuid()].limit=value;
            resolve();
        });
    }

    /**Remove Player Homes Limit */
    export async function removeHomesLimit(player: Player, value: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!hasPlayer(player)) {
                reject("Xuid not found!");
                return;
            }
            if (value < 0||(getHomesLimit(player) - value) < 0) {
                reject("Invalid value!");
                return;
            }

            homes[player.getXuid()].limit-=value;
            resolve();
        });
    }

    /**Set Player Homes Limit */
    export async function addHomesLimit(player: Player, value: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!hasPlayer(player)) {
                reject("Xuid not found!");
                return;
            }
            if (value < 0) {
                reject("Invalid value!");
                return;
            }

            homes[player.getXuid()].limit+=value;
            resolve();
        });
    }

    /**Get Player Homes Limit */
    export function getHomesLimit(player: Player): number {
        if (!hasPlayer(player)) return 0;
        else return homes[player.getXuid()].limit;
    }

    /**Check Has Player */
    export function hasPlayer(player: Player): boolean {
        return homes.hasOwnProperty(player.getXuid());
    }

    /**Add Player Data */
    export function addPlayer(player: Player): boolean {
        const xuid = player.getXuid();
        if (xuid === "") return false;
        if (hasPlayer(player)) return false;

        homes[xuid]={
            limit: getDefaultLimit(),
            homes: [],
        };
        return true;
    }

    /**Has Player Home */
    export function hasHome(player: Player, name: string): boolean {
        if (!hasPlayer(player)) return false;
        else return Boolean(homes[player.getXuid()].homes.find((home) => home.name === name));
    }

    /**Get Player Home */
    export function getHome(player: Player, name: string): Home|null {
        if (!hasPlayer(player)) return null;
        else return homes[player.getXuid()].homes.find((home) => home.name === name) ?? null;
    }

    /**Get All Player Homes */
    export function getHomes(player: Player): Home[]|null {
        if (!hasPlayer(player)) return null;
        else return homes[player.getXuid()].homes;
    }

    /**Get All Player Homes Name */
    export function getHomesName(player: Player): string[]|null {
        if (!hasPlayer(player)) return null;
        else return homes[player.getXuid()].homes.map((home) => home.name);
    }

    /**Create New Home */
    export async function createHome(player: Player, name: string, pos: BlockPos = BlockPos.create(player.getFeetPos()), dimensionId: DimensionId = player.getDimensionId()): Promise<Home> {
        return new Promise((resolve, reject) => {
            addPlayer(player);
            const xuid = player.getXuid();
            if (xuid === "") {
                reject("Xuid not found!");
                return;
            }

            const amount = getHomes(player)?.length ?? 0;
            const limit = getHomesLimit(player) ?? 0;
            const textPattern = /^[A-Za-z0-9]+$/;
            if (!limit && (amount+1) > limit) {
                reject("Maximum homes limit");
                return;
            }
            if ((amount+1) > limit) {
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

    /**Delete Player Home */
    export async function deleteHome(player: Player, name: string): Promise<Home> {
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

            homes[xuid].homes=homes[xuid].homes.filter((data) => data.name !== name);
            resolve(home);
        });
    }

    /**Set Player Home */
    export async function setHome(player: Player, name: string, pos: BlockPos = BlockPos.create(player.getFeetPos()), dimensionId: DimensionId = player.getDimensionId()): Promise<Home> {
        return new Promise((resolve, reject) => {
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

            const amount = getHomes(player)?.length ?? 0;
            const limit = getHomesLimit(player) ?? 0;
            const textPattern = /^[A-Za-z0-9]+$/;
            if (!limit && (amount+1) > limit) {
                reject("Maximum homes limit");
                return;
            }
            if ((amount+1) > limit) {
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

    /**Teleport Player */
    export function teleport(player: Player, home: string): boolean {
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
        const posFix = Vec3.create(Math.floor(pos.x)+0.5, Math.floor(pos.y)+0.5, Math.floor(pos.z)+0.5);

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
            }, timeout*1000);

            events.playerLeft.on((ev) => {
                if (ev.player === player) clearTimeout(wait);
            });

            return true;
        }

        player.sendMessage(`§aTeleporting to §r${data.name} Home`);
        player.teleport(posFix);
        player.sendMessage(`§aTeleported!`);
        return true;
    }

    export function save(message: boolean = false): void {
        fs.writeFile(configPath, JSON.stringify(config, null, 4), "utf8", (err) => {
            if (message) {
                if (err) send.error(`config.json ${err}`);
                else send.success(`config.json Saved!`);
            }
        });
        fs.writeFile(homePath, JSON.stringify(homes, null, 4), "utf8", (err) => {
            if (message) {
                if (err) send.error(`homes.json ${err}`);
                else send.success(`homes.json Saved!`);
            }
        });
    }
}

const movingCanceling = setInterval(() => {
    const players = Array.from(teleporting.entries());
    for (let i = 0; i < players.length; i++) {
        const [netId, player] = players[i];
        if (!player.isMoving()) return;

        teleporting.delete(netId);
        player.sendMessage(`§cTeleport §4Cancelled!`);
    }
}, 1);

events.playerLeft.on((data) => {
    if (teleporting.has(data.player.getNetworkIdentifier())) teleporting.delete(data.player.getNetworkIdentifier());
});

events.serverStop.on(() => {
    clearInterval(movingCanceling);
});

events.playerJoin.on((ev) => {
    HomeMain.addPlayer(ev.player);
});

events.serverOpen.on(() => {
    require("./src");
    require("./src/form");
    send.success(`Started!`);
});

events.serverClose.on(() => {
    HomeMain.save(true);
});
