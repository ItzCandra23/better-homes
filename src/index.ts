import { ServerPlayer } from "bdsx/bds/player";
import { send, sendMessage } from "./utils/message";
import * as path from "path";
import * as fs from "fs";

const hlPath = path.join(__dirname, "..", "home_limits.json");
let homeLimits: {
    normal_home_limits: number;
    player_home_limits: Record<string, number>;
} = {
    normal_home_limits: 5,
    player_home_limits: {},
};

try { homeLimits = require(hlPath) } catch(e) {}

export namespace PlayerHomeLimite {
    export function setNormalHomeLimits(limit: number, message: boolean = false, actor?: ServerPlayer): void {
        const send = new sendMessage(actor, message);
        if (limit < 0) {
            send.error(`Invalid limit`);
            return;
        }

        send.success(`Success to set &f${limit}&r in normal home limits`);
        homeLimits.normal_home_limits=limit;
    }

    export function getNormalHomeLimits(): number {
        if (homeLimits.normal_home_limits < 0) return 0;
        return homeLimits.normal_home_limits;
    }

    export function addPlayerHomeLimits(player: ServerPlayer): boolean {
        const xuid = player.getXuid();
        if (xuid === "") return false;
        if (homeLimits.player_home_limits.hasOwnProperty(xuid)) return false;
        homeLimits.player_home_limits[xuid]=getNormalHomeLimits();
        return true;
    }

    export function addHomeLimits(player: ServerPlayer, limit: number): boolean {
        addPlayerHomeLimits(player);
        const xuid = player.getXuid();
        if (xuid === "") return false;
        if (limit < 1) return false;
        homeLimits.player_home_limits[xuid]+=limit;
        return true;
    }

    export function removeHomeLimits(player: ServerPlayer, limit: number): boolean {
        addPlayerHomeLimits(player);
        const xuid = player.getXuid();
        if (xuid === "") return false;
        if (limit < 1) return false;
        if ((homeLimits.player_home_limits[xuid]-limit) < 0) {
            homeLimits.player_home_limits[xuid]=0;
            return true;
        }
        homeLimits.player_home_limits[xuid]-=limit;
        return true;
    }

    export function setHomeLimits(player: ServerPlayer, limit: number): boolean {
        addPlayerHomeLimits(player);
        const xuid = player.getXuid();
        if (xuid === "") return false;
        if (limit < 0) {
            homeLimits.player_home_limits[xuid]=0;
            return true;
        }
        homeLimits.player_home_limits[xuid]=limit;
        return true;
    }

    export function getHomeLimits(player: ServerPlayer): number|null {
        addPlayerHomeLimits(player);
        const xuid = player.getXuid();
        if (xuid === "") return null;
        return homeLimits.player_home_limits[xuid];
    }

    export function save(message: boolean = false): void {
        fs.writeFile(hlPath, JSON.stringify(homeLimits, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`home_limits.json ${err}`);
                    throw err;
                }
                else send.success(`home_limits.json Saved!`);
            }
        });
    }
}