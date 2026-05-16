export function since(time: number | Date): number {
    const timestamp = typeof time === "number" ? time : time.getTime();
    return Date.now() - timestamp;
}
