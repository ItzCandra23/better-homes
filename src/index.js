"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerHomeLimite = void 0;
const message_1 = require("./utils/message");
const path = require("path");
const fs = require("fs");
const hlPath = path.join(__dirname, "..", "home_limits.json");
let homeLimits = {
    normal_home_limits: 5,
    player_home_limits: {},
};
try {
    homeLimits = require(hlPath);
}
catch (e) { }
var PlayerHomeLimite;
(function (PlayerHomeLimite) {
    function setNormalHomeLimits(limit, message = false, actor) {
        const send = new message_1.sendMessage(actor, message);
        if (limit < 0) {
            send.error(`Invalid limit`);
            return;
        }
        send.success(`Success to set &f${limit}&r in normal home limits`);
        homeLimits.normal_home_limits = limit;
    }
    PlayerHomeLimite.setNormalHomeLimits = setNormalHomeLimits;
    function getNormalHomeLimits() {
        if (homeLimits.normal_home_limits < 0)
            return 0;
        return homeLimits.normal_home_limits;
    }
    PlayerHomeLimite.getNormalHomeLimits = getNormalHomeLimits;
    function addPlayerHomeLimits(player) {
        const xuid = player.getXuid();
        if (xuid === "")
            return false;
        if (homeLimits.player_home_limits.hasOwnProperty(xuid))
            return false;
        homeLimits.player_home_limits[xuid] = getNormalHomeLimits();
        return true;
    }
    PlayerHomeLimite.addPlayerHomeLimits = addPlayerHomeLimits;
    function addHomeLimits(player, limit) {
        addPlayerHomeLimits(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return false;
        if (limit < 1)
            return false;
        homeLimits.player_home_limits[xuid] += limit;
        return true;
    }
    PlayerHomeLimite.addHomeLimits = addHomeLimits;
    function removeHomeLimits(player, limit) {
        addPlayerHomeLimits(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return false;
        if (limit < 1)
            return false;
        if ((homeLimits.player_home_limits[xuid] - limit) < 0) {
            homeLimits.player_home_limits[xuid] = 0;
            return true;
        }
        homeLimits.player_home_limits[xuid] -= limit;
        return true;
    }
    PlayerHomeLimite.removeHomeLimits = removeHomeLimits;
    function setHomeLimits(player, limit) {
        addPlayerHomeLimits(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return false;
        if (limit < 0) {
            homeLimits.player_home_limits[xuid] = 0;
            return true;
        }
        homeLimits.player_home_limits[xuid] = limit;
        return true;
    }
    PlayerHomeLimite.setHomeLimits = setHomeLimits;
    function getHomeLimits(player) {
        addPlayerHomeLimits(player);
        const xuid = player.getXuid();
        if (xuid === "")
            return null;
        return homeLimits.player_home_limits[xuid];
    }
    PlayerHomeLimite.getHomeLimits = getHomeLimits;
    function save(message = false) {
        fs.writeFile(hlPath, JSON.stringify(homeLimits, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    message_1.send.error(`home_limits.json ${err}`);
                    throw err;
                }
                else
                    message_1.send.success(`home_limits.json Saved!`);
            }
        });
    }
    PlayerHomeLimite.save = save;
})(PlayerHomeLimite = exports.PlayerHomeLimite || (exports.PlayerHomeLimite = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2Q0FBb0Q7QUFDcEQsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUV6QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUM5RCxJQUFJLFVBQVUsR0FHVjtJQUNBLGtCQUFrQixFQUFFLENBQUM7SUFDckIsa0JBQWtCLEVBQUUsRUFBRTtDQUN6QixDQUFDO0FBRUYsSUFBSTtJQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Q0FBRTtBQUFDLE9BQU0sQ0FBQyxFQUFFLEdBQUU7QUFFaEQsSUFBaUIsZ0JBQWdCLENBNkVoQztBQTdFRCxXQUFpQixnQkFBZ0I7SUFDN0IsU0FBZ0IsbUJBQW1CLENBQUMsS0FBYSxFQUFFLFVBQW1CLEtBQUssRUFBRSxLQUFvQjtRQUM3RixNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFXLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDNUIsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsS0FBSywwQkFBMEIsQ0FBQyxDQUFDO1FBQ2xFLFVBQVUsQ0FBQyxrQkFBa0IsR0FBQyxLQUFLLENBQUM7SUFDeEMsQ0FBQztJQVRlLG9DQUFtQixzQkFTbEMsQ0FBQTtJQUVELFNBQWdCLG1CQUFtQjtRQUMvQixJQUFJLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEQsT0FBTyxVQUFVLENBQUMsa0JBQWtCLENBQUM7SUFDekMsQ0FBQztJQUhlLG9DQUFtQixzQkFHbEMsQ0FBQTtJQUVELFNBQWdCLG1CQUFtQixDQUFDLE1BQW9CO1FBQ3BELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksS0FBSyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDOUIsSUFBSSxVQUFVLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ3JFLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzFELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFOZSxvQ0FBbUIsc0JBTWxDLENBQUE7SUFFRCxTQUFnQixhQUFhLENBQUMsTUFBb0IsRUFBRSxLQUFhO1FBQzdELG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksS0FBSyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDOUIsSUFBSSxLQUFLLEdBQUcsQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBRSxLQUFLLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQVBlLDhCQUFhLGdCQU81QixDQUFBO0lBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsTUFBb0IsRUFBRSxLQUFhO1FBQ2hFLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksS0FBSyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDOUIsSUFBSSxLQUFLLEdBQUcsQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pELFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUM7WUFDdEMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBRSxLQUFLLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQVhlLGlDQUFnQixtQkFXL0IsQ0FBQTtJQUVELFNBQWdCLGFBQWEsQ0FBQyxNQUFvQixFQUFFLEtBQWE7UUFDN0QsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxLQUFLLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUM5QixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDWCxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUMsS0FBSyxDQUFDO1FBQzFDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFWZSw4QkFBYSxnQkFVNUIsQ0FBQTtJQUVELFNBQWdCLGFBQWEsQ0FBQyxNQUFvQjtRQUM5QyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUIsSUFBSSxJQUFJLEtBQUssRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQzdCLE9BQU8sVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFMZSw4QkFBYSxnQkFLNUIsQ0FBQTtJQUVELFNBQWdCLElBQUksQ0FBQyxVQUFtQixLQUFLO1FBQ3pDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN0RSxJQUFJLE9BQU8sRUFBRTtnQkFDVCxJQUFJLEdBQUcsRUFBRTtvQkFDTCxjQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUN0QyxNQUFNLEdBQUcsQ0FBQztpQkFDYjs7b0JBQ0ksY0FBSSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2FBQ2hEO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBVmUscUJBQUksT0FVbkIsQ0FBQTtBQUNMLENBQUMsRUE3RWdCLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBNkVoQyJ9