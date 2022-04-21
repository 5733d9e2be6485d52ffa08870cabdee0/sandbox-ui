import { setupWorker } from "msw";
import { handlers } from "./handlers";

// configuring service worker with its handlers
export const worker = setupWorker(...handlers);
