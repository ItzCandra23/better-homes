"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeForm = void 0;
const form_1 = require("bdsx/bds/form");
const blockpos_1 = require("bdsx/bds/blockpos");
const actor_1 = require("bdsx/bds/actor");
const message_1 = require("./utils/message");
const __1 = require("..");
/**HomeForm */
var HomeForm;
(function (HomeForm) {
    /**Menu */
    function menu(player) {
        new form_1.SimpleForm(`§l§kii§r§l§2Home§aMenu§f§kii§r`, "", [
            new form_1.FormButton("§l§8[§6Homes§8]", "path", "textures/ui/store_home_icon.png"),
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
    /**Teleport */
    function teleport(player) {
        let b = [];
        const homes = __1.HomeMain.getHomes(player);
        if (!homes)
            return;
        homes.forEach((v) => {
            b.push(new form_1.FormButton(`§l§a${v.name}§r\n§8${v.pos.x}, ${v.pos.y}, ${v.pos.z} | ${actor_1.DimensionId[v.dimension]}`));
        });
        new form_1.SimpleForm(`§l§8[§6Homes§8]`, "Click a home button to teleport.", b)
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
                    __1.HomeMain.createHome(player, rr[0], blockpos_1.BlockPos.create(player.getPosition()), player.getDimensionId())
                        .then((home) => {
                        message_1.send.success(`Create §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${actor_1.DimensionId[home.dimension]}§8]`, player);
                    })
                        .catch((err) => {
                        if (err)
                            message_1.send.error(err, player);
                    });
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
                                __1.HomeMain.createHome(player, rr[0], blockpos_1.BlockPos.create(r[1], r[2], r[3]), rr[4])
                                    .then((home) => {
                                    message_1.send.success(`Create §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${actor_1.DimensionId[home.dimension]}§8]`, player);
                                })
                                    .catch((err) => {
                                    if (err)
                                        message_1.send.error(err, player);
                                });
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
            __1.HomeMain.deleteHome(player, homes[r].name)
                .then((home) => {
                message_1.send.success(`Delete §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${actor_1.DimensionId[home.dimension]}§8]`, player);
            })
                .catch((err) => {
                if (err)
                    message_1.send.error(err, player);
            });
        });
    }
    HomeForm.remove = remove;
})(HomeForm = exports.HomeForm || (exports.HomeForm = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQTRGO0FBQzVGLGdEQUE2QztBQUM3QywwQ0FBNkM7QUFDN0MsNkNBQXVDO0FBQ3ZDLDBCQUE4QjtBQUU5QixjQUFjO0FBQ2QsSUFBaUIsUUFBUSxDQW9HeEI7QUFwR0QsV0FBaUIsUUFBUTtJQUVyQixVQUFVO0lBQ1YsU0FBZ0IsSUFBSSxDQUFDLE1BQWM7UUFDL0IsSUFBSSxpQkFBVSxDQUFDLGdDQUFnQyxFQUFFLEVBQUUsRUFBRTtZQUNqRCxJQUFJLGlCQUFVLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLGlDQUFpQyxDQUFDO1lBQzVFLElBQUksaUJBQVUsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLENBQUM7WUFDL0QsSUFBSSxpQkFBVSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQztTQUN0RSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxJQUFJO2dCQUFFLE9BQU87WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBWmUsYUFBSSxPQVluQixDQUFBO0lBRUQsY0FBYztJQUNkLFNBQWdCLFFBQVEsQ0FBQyxNQUFjO1FBQ25DLElBQUksQ0FBQyxHQUFpQixFQUFFLENBQUM7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