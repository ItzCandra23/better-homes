import { ServerPlayer } from "bdsx/bds/player";
import { CustomForm, Form, FormButton, FormData, FormDropdown, FormInput, SimpleForm } from "bdsx/bds/form";
import { dimensionIdToString, HomeAPI } from "../api";
import { BlockPos } from "bdsx/bds/blockpos";

export class HomeForm {
    static menu(player: ServerPlayer) {
        new SimpleForm(`§l§kii§r§l§2Home§aMenu§f§kii§r`, "", [
            new FormButton("§l§8[§6Teleport§8]", "path", "textures/ui/icon_steve"),
            new FormButton("§l§8[§2AddHome§8]", "path", "textures/ui/plus"),
            new FormButton("§l§8[§cRemoveHome§8]", "path", "textures/ui/minus")
        ]).sendTo(player.getNetworkIdentifier(), (f: Form<FormData>) => {
            const r = f.response;
            if (r === null) return;
            if (r === 0) this.teleport(player);
            if (r === 1) this.add(player);
        });
    }
    static teleport(player: ServerPlayer) {
        let b: FormButton[] = [];
        const homes = HomeAPI.listHome(player);
        const pos = HomeAPI.home()[player.getName()].homes.pos;
        const dimension = HomeAPI.home()[player.getName()].homes.dimension;

        homes.forEach(v => {
            b.push(new FormButton(`§l§a${v}§r\n§8${pos[homes.indexOf(v)].x}, ${pos[homes.indexOf(v)].y}, ${pos[homes.indexOf(v)].z} | ${dimensionIdToString(dimension[homes.indexOf(v)])}`));
        });

        new SimpleForm(`§l§8[§6Teleport§8]`, "Click button to teleport.", b)
        .sendTo(player.getNetworkIdentifier(), (f: Form<FormData>) => {
            const r = f.response;
            if (r === null) return;
            HomeAPI.teleport(player, homes[r], player);
        });
    }
    static add(player: ServerPlayer) {
        new SimpleForm(`§l§8[§2AddHome§8]`, "Select a method.", [
            new FormButton("§5CurrentPosition", "path", "textures/ui/book_metatag_default"),
            new FormButton("§5CustomPosition\n§cError!", "path", "textures/ui/book_edit_default")
        ]).sendTo(player.getNetworkIdentifier(), (f: Form<FormData>) => {
            const r = f.response;
            if (r === null) return;

            if (r === 0) {
                new CustomForm(`§5CurrentPosition`, [new FormInput(`Name`, "Name up to 16 letters")])
                .sendTo(player.getNetworkIdentifier(), (ff: Form<FormData>) => {
                    const rr = ff.response;
                    if (rr === null) return;
                    HomeAPI.addHome(player, rr[0], BlockPos.create(player.getPosition()), player.getDimensionId(), player);
                });
            }
            if (r === 1) {
                new CustomForm(`§5CustomPosition`, [new FormInput(`Name`, "Name up to 16 letters"), new FormInput('X', 'number'), new FormInput('Y', 'number'), new FormInput('Z', 'number'), new FormDropdown('Dimension', ["Overworld", "Nether", "TheEnd"])])
                .sendTo(player.getNetworkIdentifier(), (ff: Form<FormData>) => {
                    const rr = ff.response;
                    if (rr === null) return;
                    if (rr[1] === Number) {
                        if (rr[2] === Number) {
                            if (rr[3] === Number) {
                                HomeAPI.addHome(player, rr[0], BlockPos.create(r[1], r[2], r[3]), rr[4], player);
                            }
                        }
                    }
                });
            }
        });
    }
    static remove(player: ServerPlayer) {
        let b: FormButton[] = [];
        const homes = HomeAPI.listHome(player);
        const pos = HomeAPI.home()[player.getName()].homes.pos;
        const dimension = HomeAPI.home()[player.getName()].homes.dimension;

        homes.forEach(v => {
            b.push(new FormButton(`§l§4${v}§r\n§8${pos[homes.indexOf(v)].x}, ${pos[homes.indexOf(v)].y}, ${pos[homes.indexOf(v)].z} | ${dimensionIdToString(dimension[homes.indexOf(v)])}`));
        });

        new SimpleForm(`§l§8[§cRemove§8]`, "Click button to remove/delete.", b)
        .sendTo(player.getNetworkIdentifier(), (f: Form<FormData>) => {
            const r = f.response;
            if (r === null) return;
            HomeAPI.removeHome(player, homes[r], player);
        });
    }
}