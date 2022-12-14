"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeForm = void 0;
const form_1 = require("bdsx/bds/form");
const api_1 = require("../api");
const blockpos_1 = require("bdsx/bds/blockpos");
class HomeForm {
    static menu(player) {
        new form_1.SimpleForm(`§l§kii§r§l§2Home§aMenu§f§kii§r`, "", [
            new form_1.FormButton("§l§8[§6Teleport§8]", "path", "textures/ui/icon_steve"),
            new form_1.FormButton("§l§8[§2AddHome§8]", "path", "textures/ui/plus"),
            new form_1.FormButton("§l§8[§cRemoveHome§8]", "path", "textures/ui/minus")
        ]).sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            if (r === 0)
                this.teleport(player);
            if (r === 1)
                this.add(player);
            if (r === 2)
                this.remove(player);
        });
    }
    static teleport(player) {
        let b = [];
        const homes = api_1.HomeAPI.listHome(player);
        const pos = api_1.HomeAPI.home()[player.getName()].homes.pos;
        const dimension = api_1.HomeAPI.home()[player.getName()].homes.dimension;
        homes.forEach(v => {
            b.push(new form_1.FormButton(`§l§a${v}§r\n§8${pos[homes.indexOf(v)].x}, ${pos[homes.indexOf(v)].y}, ${pos[homes.indexOf(v)].z} | ${(0, api_1.dimensionIdToString)(dimension[homes.indexOf(v)])}`));
        });
        new form_1.SimpleForm(`§l§8[§6Teleport§8]`, "Click button to teleport.", b)
            .sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            api_1.HomeAPI.teleport(player, homes[r], player);
        });
    }
    static add(player) {
        new form_1.SimpleForm(`§l§8[§2AddHome§8]`, "Select a method.", [
            new form_1.FormButton("§5CurrentPosition", "path", "textures/ui/book_metatag_default"),
            new form_1.FormButton("§5CustomPosition\n§cError!", "path", "textures/ui/book_edit_default")
        ]).sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            if (r === 0) {
                new form_1.CustomForm(`§5CurrentPosition`, [new form_1.FormInput(`Name`, "Name up to 16 letters")])
                    .sendTo(player.getNetworkIdentifier(), (ff) => {
                    const rr = ff.response;
                    if (rr === null)
                        return;
                    api_1.HomeAPI.addHome(player, rr[0], blockpos_1.BlockPos.create(player.getPosition()), player.getDimensionId(), player);
                });
            }
            if (r === 1) {
                new form_1.CustomForm(`§5CustomPosition`, [new form_1.FormInput(`Name`, "Name up to 16 letters"), new form_1.FormInput('X', 'number'), new form_1.FormInput('Y', 'number'), new form_1.FormInput('Z', 'number'), new form_1.FormDropdown('Dimension', ["Overworld", "Nether", "TheEnd"])])
                    .sendTo(player.getNetworkIdentifier(), (ff) => {
                    const rr = ff.response;
                    if (rr === null)
                        return;
                    if (rr[1] === Number) {
                        if (rr[2] === Number) {
                            if (rr[3] === Number) {
                                api_1.HomeAPI.addHome(player, rr[0], blockpos_1.BlockPos.create(r[1], r[2], r[3]), rr[4], player);
                            }
                        }
                    }
                });
            }
        });
    }
    static remove(player) {
        let b = [];
        const homes = api_1.HomeAPI.listHome(player);
        const pos = api_1.HomeAPI.home()[player.getName()].homes.pos;
        const dimension = api_1.HomeAPI.home()[player.getName()].homes.dimension;
        homes.forEach(v => {
            b.push(new form_1.FormButton(`§l§4${v}§r\n§8${pos[homes.indexOf(v)].x}, ${pos[homes.indexOf(v)].y}, ${pos[homes.indexOf(v)].z} | ${(0, api_1.dimensionIdToString)(dimension[homes.indexOf(v)])}`));
        });
        new form_1.SimpleForm(`§l§8[§cRemove§8]`, "Click button to remove/delete.", b)
            .sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            api_1.HomeAPI.removeHome(player, homes[r], player);
        });
    }
}
exports.HomeForm = HomeForm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3Q0FBNEc7QUFDNUcsZ0NBQXNEO0FBQ3RELGdEQUE2QztBQUU3QyxNQUFhLFFBQVE7SUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFvQjtRQUM1QixJQUFJLGlCQUFVLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxFQUFFO1lBQ2pELElBQUksaUJBQVUsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsd0JBQXdCLENBQUM7WUFDdEUsSUFBSSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQztZQUMvRCxJQUFJLGlCQUFVLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixDQUFDO1NBQ3RFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFpQixFQUFFLEVBQUU7WUFDM0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxJQUFJO2dCQUFFLE9BQU87WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFvQjtRQUNoQyxJQUFJLENBQUMsR0FBaUIsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLGFBQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFD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