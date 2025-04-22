// @ts-check
/** 
 * convert object to string query
 * @param {Object} params
 * @returns {String}
*/
export const objectToQuery = (params) => {
    const stringifiedQuery = Object.fromEntries(
        Object.entries(params)
            .filter(([_, value]) => value !== undefined) // Memfilter nilai yang undefined
            .map(([key, value]) => [key, String(value)]) // Mengubah nilai menjadi string
    );

    return stringifiedQuery.toString();
}