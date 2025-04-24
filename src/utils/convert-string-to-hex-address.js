import { isHex } from "viem"

/**
 * @param {String} address
 * @returns {import("viem").Hex}
 */
export const convertToHexViem = (address) => {
    if (!isHex(address)) {
        throw new Error(`private key no hex format`);
    }

    return address;
}