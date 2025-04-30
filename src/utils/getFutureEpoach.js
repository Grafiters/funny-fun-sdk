/**
 * get future epoach from today and minutes
 * @param {number} minutes
 */
export function getFutureEpochInMinutes(minutes) {
    const date = Date.now();
    return Math.floor((date + minutes * 60 * 1000) / 1000)
}

/**
 * get time for signatue
 */
export function getTimeForSignature(){
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    const oneMonthLater = Math.floor(now.getTime() / 1000);

    return oneMonthLater;
}