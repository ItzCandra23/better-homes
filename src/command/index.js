"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actor_1 = require("bdsx/bds/actor");
const blockpos_1 = require("bdsx/bds/blockpos");
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const event_1 = require("bdsx/event");
const nativetype_1 = require("bdsx/nativetype");
const api_1 = require("../api");
const form_1 = require("../form");
event_1.events.serverOpen.on(() => {
    command_2.command.register("homeui", "Open home-ui menu.")
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        form_1.HomeForm.menu(pl);
    }, {});
    command_2.command.register("addhome", "Create a new home position.")
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        form_1.HomeForm.add(pl);
    }, {})
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        api_1.HomeAPI.addHome(pl, p.name, blockpos_1.BlockPos.create(pl.getPosition()), pl.getDimensionId(), pl);
    }, {
        name: nativetype_1.CxxString
    })
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        api_1.HomeAPI.addHome(pl, p.name, blockpos_1.BlockPos.create(p.pos.x, p.pos.y, p.pos.z), pl.getDimensionId(), pl);
    }, {
        name: nativetype_1.CxxString,
        pos: command_1.CommandPosition
    })
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        if (p.dimension === "Overworld") {
            api_1.HomeAPI.addHome(pl, p.name, blockpos_1.BlockPos.create(p.pos.x, p.pos.y, p.pos.z), actor_1.DimensionId.Overworld, pl);
        }
        if (p.dimension === "Nether") {
            api_1.HomeAPI.addHome(pl, p.name, blockpos_1.BlockPos.create(p.pos.x, p.pos.y, p.pos.z), actor_1.DimensionId.Nether, pl);
        }
        if (p.dimension === "TheEnd") {
            api_1.HomeAPI.addHome(pl, p.name, blockpos_1.BlockPos.create(p.pos.x, p.pos.y, p.pos.z), actor_1.DimensionId.TheEnd, pl);
        }
    }, {
        name: nativetype_1.CxxString,
        pos: command_1.CommandPosition,
        dimension: command_2.command.enum("CommandDimensionId", "Overworld", "Nether", "TheEnd")
    });
    command_2.command.register("removehome", "Delete/Remove your home position.")
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        form_1.HomeForm.remove(pl);
    }, {})
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        api_1.HomeAPI.removeHome(pl, p.name, pl);
    }, {
        name: nativetype_1.CxxString
    });
    command_2.command.register("home", "Teleport/check your home.")
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        form_1.HomeForm.teleport(pl);
    }, {})
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        api_1.HomeAPI.teleport(pl, p.name, pl);
    }, {
        name: nativetype_1.CxxString
    })
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        if (p.checkPos === true) {
            api_1.HomeAPI.checkHome(pl, p.name);
        }
        if (p.checkPos === false) {
            api_1.HomeAPI.teleport(pl, p.name, pl);
        }
    }, {
        name: nativetype_1.CxxString,
        checkPos: nativetype_1.bool_t
    });
    command_2.command.register("listhome", "Check your homes.")
        .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null)
            return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null)
            return;
        api_1.HomeAPI.listHome(pl, pl);
    }, {});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUE2QztBQUM3QyxnREFBNkM7QUFDN0MsOENBQW1EO0FBQ25ELDBDQUF1QztBQUN2QyxzQ0FBb0M7QUFDcEMsZ0RBQW9EO0FBQ3BELGdDQUFpQztBQUNqQyxrQ0FBbUM7QUFFbkMsY0FBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO0lBQ3RCLGlCQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQztTQUMvQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDZixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxNQUFNLEtBQUssSUFBSTtZQUFFLE9BQU87UUFDNUIsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEQsSUFBSSxFQUFFLEtBQUssSUFBSTtZQUFFLE9BQU87UUFFeEIsZUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDSCxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUM7U0FDekQsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2YsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksTUFBTSxLQUFLLElBQUk7WUFBRSxPQUFPO1FBQzVCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BELElBQUksRUFBRSxLQUFLLElBQUk7WUFBRSxPQUFPO1FBRXhCLGVBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckIsQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUNMLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNmLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLE1BQU0sS0FBSyxJQUFJO1lBQUUsT0FBTztRQUM1QixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRCxJQUFJLEVBQUUsS0FBSyxJQUFJO1lBQUUsT0FBTztRQUV4QixhQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1RixDQUFDLEVBQUU7UUFDQyxJQUFJLEVBQUUsc0JBQVM7S0FDbEIsQ0FBQztTQUNELFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNmLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLE1BQU0sS0FBSyxJQUFJO1lBQUUsT0FBTztRQUM1QixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRCxJQUFJLEVBQUUsS0FBSyxJQUFJO1lBQUUsT0FBTztRQUV4QixhQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JHLENBQUMsRUFBRTtRQUNDLElBQUksRUFBRSxzQkFBUztRQUNmLEdBQUcsRUFBRSx5QkFBZTtLQUN2QixDQUFDO1NBQ0QsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2YsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksTUFBTSxLQUFLLElBQUk7WUFBRSxPQUFPO1FBQzVCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BELElBQUksRUFBRSxLQUFLLElBQUk7WUFBRSxPQUFPO1FBRXhCLElBQUksQ0FBQyxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7WUFDN0IsYUFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG1CQUFXLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3RHO1FBQ0QsSUFBSSxDQUFDLENBQUMsU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUMxQixhQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsbUJBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbkc7UUFDRCxJQUFJLENBQUMsQ0FBQyxTQUFTLEtBQUssUUFBUSxFQUFFO1lBQzFCLGFBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxtQkFBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNuRztJQUNMLENBQUMsRUFBRTtRQUNDLElBQUksRUFBRSxzQkFBUztRQUNmLEdBQUcsRUFBRSx5QkFBZTtRQUNwQixTQUFTLEVBQUUsaUJBQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUM7S0FDakYsQ0FBQyxDQUFDO0lBQ0gsaUJBQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLG1DQUFtQyxDQUFDO1NBQ2xFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNmLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLE1BQU0sS0FBSyxJQUFJO1lBQUUsT0FBTztRQUM1QixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRCxJQUFJLEVBQUUsS0FBSyxJQUFJO1lBQUUsT0FBTztRQUV4QixlQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDTCxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDZixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxNQUFNLEtBQUssSUFBSTtZQUFFLE9BQU87UUFDNUIsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEQsSUFBSSxFQUFFLEtBQUssSUFBSTtZQUFFLE9BQU87UUFFeEIsYUFBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDLEVBQUU7UUFDQyxJQUFJLEVBQUUsc0JBQVM7S0FDbEIsQ0FBQyxDQUFDO0lBQ0gsaUJBQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLDJCQUEyQixDQUFDO1NBQ3BELFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNmLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLE1BQU0sS0FBSyxJQUFJO1lBQUUsT0FBTztRQUM1QixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRCxJQUFJLEVBQUUsS0FBSyxJQUFJO1lBQUUsT0FBTztRQUV4QixlQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDTCxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDZixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBSSxNQUFNLEtBQUssSUFBSTtZQUFFLE9BQU87UUFDNUIsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEQsSUFBSSxFQUFFLEtBQUssSUFBSTtZQUFFLE9BQU87UUFFeEIsYUFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDLEVBQUU7UUFDQyxJQUFJLEVBQUUsc0JBQVM7S0FDbEIsQ0FBQztTQUNELFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNmLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3QixJQUFJLE1BQU0sS0FBSyxJQUFJO1lBQUUsT0FBTztRQUM1QixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRCxJQUFJLEVBQUUsS0FBSyxJQUFJO1lBQUUsT0FBTztRQUV4QixJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ3JCLGFBQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQztRQUNELElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7WUFDdEIsYUFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNwQztJQUNMLENBQUMsRUFBRTtRQUNDLElBQUksRUFBRSxzQkFBUztRQUNmLFFBQVEsRUFBRSxtQkFBTTtLQUNuQixDQUFDLENBQUM7SUFDSCxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUM7U0FDaEQsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2YsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzdCLElBQUksTUFBTSxLQUFLLElBQUk7WUFBRSxPQUFPO1FBQzVCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BELElBQUksRUFBRSxLQUFLLElBQUk7WUFBRSxPQUFPO1FBRXhCLGFBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNmLENBQUMsQ0FBQyxDQUFDIn0=