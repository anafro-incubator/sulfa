export type Position = {
    x: number;
    y: number;
};

export const positions = {
    random(): Position {
        return {
            x: window.innerWidth * Math.random(),
            y: window.innerHeight * Math.random(),
        };
    },

    center(): Position {
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
    },
};
