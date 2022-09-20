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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3Q0FBNEc7QUFDNUcsZ0NBQXNEO0FBQ3RELGdEQUE2QztBQUU3QyxNQUFhLFFBQVE7SUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFvQjtRQUM1QixJQUFJLGlCQUFVLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxFQUFFO1lBQ2pELElBQUksaUJBQVUsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsd0JBQXdCLENBQUM7WUFDdEUsSUFBSSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQztZQUMvRCxJQUFJLGlCQUFVLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixDQUFDO1NBQ3RFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFpQixFQUFFLEVBQUU7WUFDM0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxJQUFJO2dCQUFFLE9BQU87WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQW9CO1FBQ2hDLElBQUksQ0FBQyxHQUFpQixFQUFFLENBQUM7UUFDekIsTUFBTSxLQUFLLEdBQUcsYUFBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxNQUFNLEdBQUcsR0FBRyxhQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUN2RCxNQUFNLFNBQVMsR0FBRyxhQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUVuRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2QsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBQSx5QkFBbUIsRUFBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckwsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLGlCQUFVLENBQUMsb0JBQW9CLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO2FBQ25FLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQWlCLEVBQUUsRUFBRTtZQUN6RCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLElBQUk7Z0JBQUUsT0FBTztZQUN2QixhQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFvQjtRQUMzQixJQUFJLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUU7WUFDcEQsSUFBSSxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsQ0FBQztZQUMvRSxJQUFJLGlCQUFVLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxFQUFFLCtCQUErQixDQUFDO1NBQ3hGLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFpQixFQUFFLEVBQUU7WUFDM0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxJQUFJO2dCQUFFLE9BQU87WUFFdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNULElBQUksaUJBQVUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksZ0JBQVMsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO3FCQUNwRixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxFQUFrQixFQUFFLEVBQUU7b0JBQzFELE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUksRUFBRSxLQUFLLElBQUk7d0JBQUUsT0FBTztvQkFDeEIsYUFBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDM0csQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUNELElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDVCxJQUFJLGlCQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLGdCQUFTLENBQUMsTUFBTSxFQUFFLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxnQkFBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUFJLGdCQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxFQUFFLElBQUksZ0JBQVMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUUsSUFBSSxtQkFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMvTyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxFQUFrQixFQUFFLEVBQUU7b0JBQzFELE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUksRUFBRSxLQUFLLElBQUk7d0JBQUUsT0FBTztvQkFDeEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO3dCQUNsQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7NEJBQ2xCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRTtnQ0FDbEIsYUFBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDOzZCQUNwRjt5QkFDSjtxQkFDSjtnQkFDTCxDQUFDLENBQUMsQ0FBQzthQUNOO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFvQjtRQUM5QixJQUFJLENBQUMsR0FBaUIsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLGFBQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsTUFBTSxHQUFHLEdBQUcsYUFBTyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDdkQsTUFBTSxTQUFTLEdBQUcsYUFBTyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFFbkUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNkLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUEseUJBQW1CLEVBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxpQkFBVSxDQUFDLGtCQUFrQixFQUFFLGdDQUFnQyxFQUFFLENBQUMsQ0FBQzthQUN0RSxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFpQixFQUFFLEVBQUU7WUFDekQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxJQUFJO2dCQUFFLE9BQU87WUFDdkIsYUFBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBL0VELDRCQStFQyJ9