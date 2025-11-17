export const GAME_WIDTH = 900;
export const GAME_Height = 300;
export const FRAME_RATE = 70;
export let SPEED = 15;
export const MIN = 1000;
export const MAX = 2000;
export const GRAVITY = 10;

export function increaseSpeed(amount = 1) {
    SPEED += amount;             // <-- speed booster
}

// export -- wrap in an object, then export {}