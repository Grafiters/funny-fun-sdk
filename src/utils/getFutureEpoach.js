/**
 * get future epoach from today and minutes
 * @param {number} minutes
 */
export function getFutureEpochInMinutes(minutes) {
    const date = Date.now();
    return Math.floor((date + minutes * 60 * 1000) / 1000)
}
