import { deviate } from "./random";

export type Vector2D = {
    x: number;
    y: number;
};

export const vectors = {
    random(length: number = 1): Vector2D {
        const angle = deviate(Math.PI);
        const x = Math.cos(angle) * length;
        const y = Math.sin(angle) * length;

        return { x, y };
    }
};
