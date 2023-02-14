"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeForm = void 0;
const form_1 = require("bdsx/bds/form");
const __1 = require("..");
const blockpos_1 = require("bdsx/bds/blockpos");
const actor_1 = require("bdsx/bds/actor");
var HomeForm;
(function (HomeForm) {
    function menu(player) {
        new form_1.SimpleForm(`§l§kii§r§l§2Home§aMenu§f§kii§r`, "", [
            new form_1.FormButton("§l§8[§6Teleport§8]", "path", "textures/ui/icon_steve"),
            new form_1.FormButton("§l§8[§2AddHome§8]", "path", "textures/ui/plus"),
            new form_1.FormButton("§l§8[§cRemoveHome§8]", "path", "textures/ui/minus")
        ]).sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            if (r === 0)
                teleport(player);
            if (r === 1)
                add(player);
            if (r === 2)
                remove(player);
        });
    }
    HomeForm.menu = menu;
    function teleport(player) {
        let b = [];
        const homes = __1.HomeMain.getHomes(player);
        if (!homes)
            return;
        homes.forEach((v) => {
            b.push(new form_1.FormButton(`§l§a${v.name}§r\n§8${v.pos.x}, ${v.pos.y}, ${v.pos.z} | ${actor_1.DimensionId[v.dimension]}`));
        });
        new form_1.SimpleForm(`§l§8[§6Teleport§8]`, "Click button to teleport.", b)
            .sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            __1.HomeMain.teleport(player, homes[r].name);
        });
    }
    HomeForm.teleport = teleport;
    function add(player) {
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
                    __1.HomeMain.createHome(player, rr[0], player.getPosition(), player.getDimensionId());
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
                                __1.HomeMain.createHome(player, rr[0], blockpos_1.Vec3.create(r[1], r[2], r[3]), rr[4]);
                            }
                        }
                    }
                });
            }
        });
    }
    HomeForm.add = add;
    function remove(player) {
        let b = [];
        const homes = __1.HomeMain.getHomes(player);
        if (!homes)
            return;
        homes.forEach((v) => {
            b.push(new form_1.FormButton(`§l§4${v.name}§r\n§8${v.pos.x}, ${v.pos.y}, ${v.pos.z} | ${actor_1.DimensionId[v.dimension]}`));
        });
        new form_1.SimpleForm(`§l§8[§cRemove§8]`, "Click button to remove/delete.", b)
            .sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            __1.HomeMain.deleteHome(player, homes[r].name);
        });
    }
    HomeForm.remove = remove;
})(HomeForm = exports.HomeForm || (exports.HomeForm = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQTRGO0FBQzVGLDBCQUE4QjtBQUM5QixnREFBeUM7QUFDekMsMENBQTZDO0FBRTdDLElBQWlCLFFBQVEsQ0E4RXhCO0FBOUVELFdBQWlCLFFBQVE7SUFDckIsU0FBZ0IsSUFBSSxDQUFDLE1BQW9CO1FBQ3JDLElBQUksaUJBQVUsQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUU7WUFDakQsSUFBSSxpQkFBVSxDQUFDLG9CQUFvQixFQUFFLE1BQU0sRUFBRSx3QkFBd0IsQ0FBQztZQUN0RSxJQUFJLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFDO1lBQy9ELElBQUksaUJBQVUsQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLENBQUM7U0FDdEUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssSUFBSTtnQkFBRSxPQUFPO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQVplLGFBQUksT0FZbkIsQ0FBQTtJQUNELFNBQWdCLFFBQVEsQ0FBQyxNQUFvQjtRQUN6QyxJQUFJLENBQUMsR0FBaUIsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLFlBQVEsQ0FBQyxRQUFRLENBQUMs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