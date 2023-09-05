import { Player } from "bdsx/bds/player";
import { CustomForm, FormButton, FormDropdown, FormInput, SimpleForm } from "bdsx/bds/form";
import { BlockPos } from "bdsx/bds/blockpos";
import { DimensionId } from "bdsx/bds/actor";
import { send } from "./utils/message";
import { HomeMain } from "..";

/**HomeForm */
export namespace HomeForm {

    /**Menu */
    export function menu(player: Player) {
        new SimpleForm(`§l§kii§r§l§2Home§aMenu§f§kii§r`, "", [
            new FormButton("§l§8[§6Homes§8]", "path", "textures/ui/store_home_icon.png"),
            new FormButton("§l§8[§2AddHome§8]", "path", "textures/ui/plus"),
            new FormButton("§l§8[§cRemoveHome§8]", "path", "textures/ui/minus")
        ]).sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null) return;
            if (r === 0) teleport(player);
            if (r === 1) add(player);
            if (r === 2) remove(player);
        });
    }

    /**Teleport */
    export function teleport(player: Player) {
        let b: FormButton[] = [];
        const homes = HomeMain.getHomes(player);
        if (!homes) return;

        homes.forEach((v) => {
            b.push(new FormButton(`§l§a${v.name}§r\n§8${v.pos.x}, ${v.pos.y}, ${v.pos.z} | ${DimensionId[v.dimension]}`));
        });

        new SimpleForm(`§l§8[§6Homes§8]`, "Click a home button to teleport.", b)
        .sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null) return;
            HomeMain.teleport(player, homes[r].name);
        });
    }
    export function add(player: Player) {
        new SimpleForm(`§l§8[§2AddHome§8]`, "Select a method.", [
            new FormButton("§5CurrentPosition", "path", "textures/ui/book_metatag_default"),
            new FormButton("§5CustomPosition\n§cError!", "path", "textures/ui/book_edit_default")
        ]).sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null) return;

            if (r === 0) {
                new CustomForm(`§5CurrentPosition`, [new FormInput(`Name`, "Name up to 16 letters")])
                .sendTo(player.getNetworkIdentifier(), (ff) => {
                    const rr = ff.response;
                    if (rr === null) return;
                    HomeMain.createHome(player, rr[0], BlockPos.create(player.getPosition()), player.getDimensionId())
                    .then((home) => {
                        send.success(`Create §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, player);
                    })
                    .catch((err) => {
                        if (err) send.error(err, player);
                    });
                });
            }
            if (r === 1) {
                new CustomForm(`§5CustomPosition`, [new FormInput(`Name`, "Name up to 16 letters"), new FormInput('X', 'number'), new FormInput('Y', 'number'), new FormInput('Z', 'number'), new FormDropdown('Dimension', ["Overworld", "Nether", "TheEnd"])])
                .sendTo(player.getNetworkIdentifier(), (ff) => {
                    const rr = ff.response;
                    if (rr === null) return;
                    if (rr[1] === Number) {
                        if (rr[2] === Number) {
                            if (rr[3] === Number) {
                                HomeMain.createHome(player, rr[0], BlockPos.create(r[1], r[2], r[3]), rr[4])
                                .then((home) => {
                                    send.success(`Create §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, player);
                                })
                                .catch((err) => {
                                    if (err) send.error(err, player);
                                });
                            }
                        }
                    }
                });
            }
        });
    }
    export function remove(player: Player) {
        let b: FormButton[] = [];
        const homes = HomeMain.getHomes(player);
        if (!homes) return;

        homes.forEach((v) => {
            b.push(new FormButton(`§l§4${v.name}§r\n§8${v.pos.x}, ${v.pos.y}, ${v.pos.z} | ${DimensionId[v.dimension]}`));
        });

        new SimpleForm(`§l§8[§cRemove§8]`, "Click button to remove/delete.", b)
        .sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null) return;
            HomeMain.deleteHome(player, homes[r].name)
            .then((home)  => {
                send.success(`Delete §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, player);
            })
            .catch((err) => {
                if (err) send.error(err, player);
            });
        });
    }
}