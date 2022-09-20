import "./src";
import { events } from "bdsx/event";

events.serverOpen.on(() => { console.log(`[Better-Homes] Started!`) });