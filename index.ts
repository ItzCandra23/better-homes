import { events } from "bdsx/event";
import { HomeAPI } from "./src/api";

events.serverOpen.on(() => {
    HomeAPI.writeFileNoMessage();
    require("./src");
    console.log(`[Better-Homes] Started!`);
});