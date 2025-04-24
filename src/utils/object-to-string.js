// @ts-check
/** 
 * convert object to string query
 * @param {Object} params
 * @returns {String}
*/
export const objectToQuery = (params) => {
    const stringifiedQuery = Object.entries(params)
        .filter(([_, value]) => value !== undefined) // 🧹 remove undefined
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    
    return stringifiedQuery;
}