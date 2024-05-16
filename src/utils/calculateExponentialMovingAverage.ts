
export default function calculateExponentialMovingAverage(array: Array<number>, alpha = 0.5) {
    if (array.length === 0) {
        return 0;
    }
    let ema = array[0];
    for (let i = 1; i < array.length; i++) {
        ema = alpha * array[i] + (1 - alpha) * ema;
    }
    return ema;
}
