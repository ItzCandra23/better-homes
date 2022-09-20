import { DimensionId } from "bdsx/bds/actor";
import { BlockPos } from "bdsx/bds/blockpos";
import { CommandPosition } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { events } from "bdsx/event";
import { bool_t, CxxString } from "bdsx/nativetype";
import { HomeAPI } from "../api";
import { HomeForm } from "../form";

events.serverOpen.on(() => {
    command.register("homeui", "Open home-ui menu.")
    .overload((p, o) => {
        const entity = o.getEntity();
        if (entity === null) return;
        const pl = entity.getNetworkIdentifier().getActor();
        if (pl === null) return;

        HomeForm.menu(pl);
    }, {});
        command.register("addhome", "Create a new home position.")
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            HomeForm.add(pl);
        }, {})
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            HomeAPI.addHome(pl, p.name, BlockPos.create(pl.getPosition()), pl.getDimensionId(), pl);
        }, {
            name: CxxString
        })
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            HomeAPI.addHome(pl, p.name, BlockPos.create(p.pos.x, p.pos.y, p.pos.z), pl.getDimensionId(), pl);
        }, {
            name: CxxString,
            pos: CommandPosition
        })
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            if (p.dimension === "Overworld") {
                HomeAPI.addHome(pl, p.name, BlockPos.create(p.pos.x, p.pos.y, p.pos.z), DimensionId.Overworld, pl);
            }
            if (p.dimension === "Nether") {
                HomeAPI.addHome(pl, p.name, BlockPos.create(p.pos.x, p.pos.y, p.pos.z), DimensionId.Nether, pl);
            }
            if (p.dimension === "TheEnd") {
                HomeAPI.addHome(pl, p.name, BlockPos.create(p.pos.x, p.pos.y, p.pos.z), DimensionId.TheEnd, pl);
            }
        }, {
            name: CxxString,
            pos: CommandPosition,
            dimension: command.enum("CommandDimensionId", "Overworld", "Nether", "TheEnd")
        });
        command.register("removehome", "Delete/Remove your home position.")
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            HomeForm.remove(pl);
        }, {})
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            HomeAPI.removeHome(pl, p.name, pl);
        }, {
            name: CxxString
        });
        command.register("home", "Teleport/check your home.")
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            HomeForm.teleport(pl);
        }, {})
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            HomeAPI.teleport(pl, p.name, pl);
        }, {
            name: CxxString
        })
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            if (p.checkPos === true) {
                HomeAPI.checkHome(pl, p.name);
            }
            if (p.checkPos === false) {
                HomeAPI.teleport(pl, p.name, pl);
            }
        }, {
            name: CxxString,
            checkPos: bool_t
        });
        command.register("listhome", "Check your homes.")
        .overload((p, o) => {
            const entity = o.getEntity();
            if (entity === null) return;
            const pl = entity.getNetworkIdentifier().getActor();
            if (pl === null) return;

            HomeAPI.listHome(pl, pl);
        }, {});
});