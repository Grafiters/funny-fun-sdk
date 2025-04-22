import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@solana/web3.js";

export const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

/**
 * @typedef {object} CreateMetadataV3AccountParams
 * @property {PublicKey} mint - The mint account.
 * @property {PublicKey} authority - The update authority.
 * @property {PublicKey} payer - The payer account.
 * @property {string} name - The name of the token.
 * @property {string} symbol - The symbol of the token.
 * @property {string} uri - The URI of the token metadata.
 * @property {number} [sellerFeeBasisPoints] - The seller fee basis points.
 */

/**
 * @param {PublicKey} mint
 * @returns {PublicKey}
 */
export function getMetadataAddress(mint) {
    const [metadataAddress] = PublicKey.findProgramAddressSync(
       [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
       METAPLEX_PROGRAM_ID,
    );
    return metadataAddress;
 }

/**
 * @param {CreateMetadataV3AccountParams} params
 */
export function createCreateMetadataAccountV3Instruction(params) {
    const textEncoder = new TextEncoder();
 
    const encodedName = textEncoder.encode(params.name);
    const encodedSymbol = textEncoder.encode(params.symbol);
    const encodedUri = textEncoder.encode(params.uri);
 
    const numOfCreators = 1;
    const creatorAddress = params.authority;
 
    const byteSize =
       0 +
       1 + // instruction tag
       4 + // name length
       encodedName.length + // name
       4 + // symbol length
       encodedSymbol.length + // symbol
       4 + // uri length
       encodedUri.length + // uri
       2 + // seller fee basis points
       1 + // creators options flag
       4 + // num of creators
       (0 +
          32 + // creator address
          1 + // creator verified
          1) * // creator share
          numOfCreators +
       1 + // collections options flag
       /** @todo add collections data */
       1 + // uses options flag
       /** @todo add collections data */
       1 + // is mutable
       1; // collectionDetails options flag
    /** @todo add collectionDetails data */
    const u8a = new Uint8Array(byteSize);
    const dataView = new DataView(u8a.buffer);
    let offset = 0;
 
    dataView.setUint8(offset, 33); // instruction tag
    offset += 1;
 
    dataView.setUint32(offset, encodedName.byteLength, true); // name length
    offset += 4;
 
    u8a.set(encodedName, offset); // name
    offset += encodedName.byteLength;
 
    dataView.setUint32(offset, encodedSymbol.byteLength, true); // symbol length
    offset += 4;
 
    u8a.set(encodedSymbol, offset); // symbol
    offset += encodedSymbol.byteLength;
 
    dataView.setUint32(offset, encodedUri.byteLength, true); // uri length
    offset += 4;
 
    u8a.set(encodedUri, offset); // uri
    offset += encodedUri.byteLength;
 
    dataView.setUint16(offset, params.sellerFeeBasisPoints ?? 0, true); // seller fee basis points
    offset += 2;
 
    dataView.setUint8(offset, 1); // creators options flag
    offset += 1;
 
    dataView.setUint32(offset, numOfCreators, true); // creators length
    offset += 4;
 
    u8a.set(creatorAddress.toBytes(), offset); // creator address // creator address
    offset += 32;
 
    dataView.setUint8(offset, 1); // creator verified
    offset += 1;
 
    dataView.setUint8(offset, 100); // creator share
    offset += 1;
 
    dataView.setUint8(offset, 0); // collections option flag
    offset += 1;
 
    /** @todo add collections data */
 
    dataView.setUint8(offset, 0); // uses options flag
    offset += 1;
 
    /** @todo add uses data */
 
    dataView.setUint8(offset, 0); // is mutable
    offset += 1;
 
    dataView.setUint8(offset, 0); // collectionDetails options flag
    offset += 1;
 
    /** @todo add collectionDetails data */
 
    const instruction = new TransactionInstruction({
       keys: [
          { pubkey: getMetadataAddress(params.mint), isSigner: false, isWritable: true },
          { pubkey: params.mint, isSigner: false, isWritable: false },
          { pubkey: params.authority, isSigner: true, isWritable: false },
          { pubkey: params.payer, isSigner: true, isWritable: true },
          { pubkey: params.authority, isSigner: true, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
       ],
       programId: METAPLEX_PROGRAM_ID,
       data: Buffer.from(u8a),
    });
 
    return instruction;
 }
 