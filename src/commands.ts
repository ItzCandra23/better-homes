import { DimensionId } from "bdsx/bds/actor";
import { Vec3 } from "bdsx/bds/blockpos";
import { CommandPermissionLevel, CommandPosition, PlayerCommandSelector } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { CxxString, int32_t } from "bdsx/nativetype";
import { PlayerHomeLimite } from ".";
import { HomeMain } from "..";
import { HomeForm } from "./form";
import { send } from "./utils/message";

command.register("homeui", "Open home-ui menu.")
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeForm.menu(pl);
}, {});

command.register("addhome", "Create a new home position.")
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeForm.add(pl);
}, {})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeMain.createHome(pl, p.name, pl.getPosition(), pl.getDimensionId());
}, {
    name: CxxString
})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    let pos = Vec3.create(p.pos);
    if (p.pos.local) pos.set(pl.getPosition());

    HomeMain.createHome(pl, p.name, pos, pl.getDimensionId());
}, {
    name: CxxString,
    pos: CommandPosition
})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    let pos = Vec3.create(p.pos);
    if (p.pos.local) pos.set(pl.getPosition());

    HomeMain.createHome(pl, p.name, pos, p.dimension);
}, {
    name: CxxString,
    pos: CommandPosition,
    dimension: command.enum("DimensionId", DimensionId)
});

command.register("sethome", "Create a new home position.")
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeForm.add(pl);
}, {})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeMain.createHome(pl, p.name, pl.getPosition(), pl.getDimensionId());
}, {
    name: CxxString
})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    let pos = Vec3.create(p.pos);
    if (p.pos.local) pos.set(pl.getPosition());

    HomeMain.createHome(pl, p.name, pos, pl.getDimensionId());
}, {
    name: CxxString,
    pos: CommandPosition
})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    let pos = Vec3.create(p.pos);
    if (p.pos.local) pos.set(pl.getPosition());

    HomeMain.createHome(pl, p.name, pos, p.dimension);
}, {
    name: CxxString,
    pos: CommandPosition,
    dimension: command.enum("DimensionId", DimensionId)
});

command.register("removehome", "Delete your home position.")
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeForm.remove(pl);
}, {})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeMain.deleteHome(pl, p.name);
}, {
    name: CxxString
});

command.register("home", "Teleport to your home position.")
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeForm.teleport(pl);
}, {})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeMain.teleport(pl, p.name);
}, {
    name: CxxString
});

command.register("listhome", "Check your homes.")
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    pl.sendMessage(`§aHomes: §r${(HomeMain.getHomesName(pl) ?? []).toString().replace(/,/g, "§r§a, §r")}`);
}, {});

command.register("setmaxhomes", "Change limit player homes.", CommandPermissionLevel.Operator)
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        PlayerHomeLimite.setNormalHomeLimits(p.maximum, true);
        return;
    }
    if (!pl.isPlayer()) return;

    PlayerHomeLimite.setNormalHomeLimits(p.maximum, true, pl);
}, {
    normal: command.enum("set_normal", "normal"),
    maximum: int32_t
})
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    for (const target of p.target.newResults(o)) {
        if (target.isPlayer()) {
            PlayerHomeLimite.setHomeLimits(target, p.maximum);
        }
    }
    PlayerHomeLimite.setHomeLimits(pl, p.maximum);
}, {
    player: command.enum("set_player", "player"),
    target: PlayerCommandSelector,
    maximum: int32_t
});