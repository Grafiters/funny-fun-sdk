// @ts-check

import { createPublicClient, http } from "viem";
import { bsc, bscTestnet, holesky } from "viem/chains";
import { peta } from "./chains";

/** @type {Record<number, import("viem").PublicClient>} */
export const blockchains = {
    [holesky.id]: /** @type {any} */ (createPublicClient({
      chain: holesky,
      transport: http(),
    })),
    [peta.id]: /** @type {any} */ (createPublicClient({
      chain: peta,
      transport: http(),
    })),
    [bsc.id]: /** @type {any} */ (createPublicClient({
      chain: bsc,
      transport: http(),
    })),
    [bscTestnet.id]: /** @type {any} */ (createPublicClient({
      chain: bscTestnet,
      transport: http(),
    })),
};