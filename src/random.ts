export type Range = {
    min: number;
    max: number;
}

export function randomInRange({ min, max }: Range): number {
    return randomInt(min, max);
}

export function randomInt(min: number, max: number | undefined = undefined): number {
    if (max === undefined) {
        max = min;
        min = 0;
    }

    return Math.floor(Math.random() * (max - min) + min);
}

export function deviate(number: number) {
    return number * randomDeviation();
}

function randomDeviation(): number {
    return 2 * Math.random() - 1;
}
