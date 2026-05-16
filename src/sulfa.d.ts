import { createSulfa } from "./index";

declare global {
    interface Window {
        createSulfa: typeof createSulfa,
    }
}
