import { DimensionId } from "bdsx/bds/actor";
import { BlockPos } from "bdsx/bds/blockpos";
import { CommandPermissionLevel, CommandPosition, PlayerCommandSelector } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { CxxString, int32_t } from "bdsx/nativetype";
import { HomeMain } from "..";
import { HomeForm } from "./form";
import { send } from "./utils/message";

/**HomeUI */
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

/**AddHome */
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

    HomeMain.createHome(pl, p.name, BlockPos.create(pl.getPosition()), pl.getDimensionId())
    .then((home) => {
        send.success(`Create §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, pl);
    })
    .catch((err) => {
        if (err) send.error(err, pl);
    });
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

    let pos = BlockPos.create(p.pos.getPosition(o));

    HomeMain.createHome(pl, p.name, pos, pl.getDimensionId())
    .then((home) => {
        send.success(`Create §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, pl);
    })
    .catch((err) => {
        if (err) send.error(err, pl);
    });;
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

    let pos = BlockPos.create(p.pos.getPosition(o));

    HomeMain.createHome(pl, p.name, pos, p.dimension)
    .then((home) => {
        send.success(`Create §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, pl);
    })
    .catch((err) => {
        if (err) send.error(err, pl);
    });;
}, {
    name: CxxString,
    pos: CommandPosition,
    dimension: command.enum("DimensionId", DimensionId)
});

/**SetHome */
command.register("sethome", "Create a new home position.")
.overload((p, o) => {
    const pl = o.getEntity();
    if (!pl) {
        send.error(`This command not for console`);
        return;
    }
    if (!pl.isPlayer()) return;

    HomeMain.setHome(pl, p.name, BlockPos.create(pl.getPosition()), pl.getDimensionId())
    .then((home) => {
        send.success(`Set §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, pl);
    })
    .catch((err) => {
        if (err) send.error(err, pl);
    });
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

    let pos = BlockPos.create(p.pos.getPosition(o));

    HomeMain.setHome(pl, p.name, pos, pl.getDimensionId())
    .then((home) => {
        send.success(`Set §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, pl);
    })
    .catch((err) => {
        if (err) send.error(err, pl);
    });
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

    let pos = BlockPos.create(p.pos.getPosition(o));

    HomeMain.setHome(pl, p.name, pos, p.dimension)
    .then((home) => {
        send.success(`Set §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, pl);
    })
    .catch((err) => {
        if (err) send.error(err, pl);
    });
}, {
    name: CxxString,
    pos: CommandPosition,
    dimension: command.enum("DimensionId", DimensionId)
});

/**RemoveHome */
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

    HomeMain.deleteHome(pl, p.name)
    .then((home)  => {
        send.success(`Delete §8[§r${home.name}§r, §7[§rx: ${home.pos.x}, y: ${home.pos.y}, z: ${home.pos.z}§7]§r ${DimensionId[home.dimension]}§8]`, pl);
    })
    .catch((err) => {
        if (err) send.error(err, pl);
    });
}, {
    name: CxxString
});

/**Home */
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

/**ListHome */
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

/**SetHomesLimit */
command.register("sethomeslimit", "Change limit player homes.", CommandPermissionLevel.Operator)
.overload((p, o) => {
    const pl = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;

    HomeMain.setDefaultLimit(p.maximum)
    .then(() => {
        send.success(`Set §r${p.maximum}§a as default homes limit`, pl);
    })
    .catch((err) => {
        if (err) send.error(err, pl);
    });
}, {
    normal: command.enum("set_normal", "normal"),
    maximum: int32_t
})
.overload((p, o) => {
    const pl = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;

    for (const target of p.target.newResults(o)) {
        HomeMain.setHomesLimit(target, p.maximum)
        .then(() => {
            send.success(`Set §r${p.maximum}§a as §r${target.getName()}§a homes limit`, pl);
        })
        .catch((err) => {
            if (err) send.error(err, pl);
        });
    }
}, {
    player: command.enum("set_player", "player"),
    target: PlayerCommandSelector,
    maximum: int32_t
});