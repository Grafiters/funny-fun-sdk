// @ts-check
import { RENT_PROGRAM_ID } from '@raydium-io/raydium-sdk-v2';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';

/** @typedef {import('@solana/web3.js').MessageCompiledInstruction} MessageCompiledInstruction */

export const STREAM_FLOW_CREATE_IX_TAG = 8576854823835016728n;

/**
 * @typedef {object} StreamflowCreateInstructionDataObject
 * @property {bigint} startTime
 * @property {bigint} netAmountDeposited
 * @property {bigint} [period]
 * @property {bigint} [amountPerPeriod]
 * @property {bigint} [cliff]
 * @property {bigint} [cliffAmount]
 * @property {boolean} [cancelableBySender]
 * @property {boolean} [cancelableByRecipient]
 * @property {boolean} [automaticWithdrawal]
 * @property {boolean} [transferableBySender]
 * @property {boolean} [transferableByRecipient]
 * @property {boolean} [canTopup]
 * @property {string} [streamName]
 * @property {bigint} [withdrawFrequency]
 * @property {number} [ghost]
 * @property {boolean} [pausable]
 * @property {boolean} [canUpdateRate]
 */

/**
 * @param {StreamflowCreateInstructionDataObject} params
 * @returns {Uint8Array}
 */
function packStreamflowCreateInstructionData(params) {
  const streamflowCreateIxU8a = new Uint8Array(
    0
    + BigInt64Array.BYTES_PER_ELEMENT // tag
    + BigInt64Array.BYTES_PER_ELEMENT // startTime
    + BigInt64Array.BYTES_PER_ELEMENT // netAmountDeposited
    + BigInt64Array.BYTES_PER_ELEMENT // period
    + BigInt64Array.BYTES_PER_ELEMENT // amountPerPeriod
    + BigInt64Array.BYTES_PER_ELEMENT // cliff
    + BigInt64Array.BYTES_PER_ELEMENT // cliffAmount
    + Uint8Array.BYTES_PER_ELEMENT // cancelableBySender
    + Uint8Array.BYTES_PER_ELEMENT // cancelableByRecipient
    + Uint8Array.BYTES_PER_ELEMENT // automaticWithdrawal
    + Uint8Array.BYTES_PER_ELEMENT // transferableBySender
    + Uint8Array.BYTES_PER_ELEMENT // transferableByRecipient
    + Uint8Array.BYTES_PER_ELEMENT // canTopup
    + 64 // streamName
    + BigInt64Array.BYTES_PER_ELEMENT // withdrawFrequency
    + Uint32Array.BYTES_PER_ELEMENT // ghost
    + Uint8Array.BYTES_PER_ELEMENT // pausable
    + Uint8Array.BYTES_PER_ELEMENT // canUpdateRate
    ,
  );
  const streamflowCreateIxDataView = new DataView(streamflowCreateIxU8a.buffer);
  let offset = 0;

  streamflowCreateIxDataView.setBigUint64(offset, STREAM_FLOW_CREATE_IX_TAG, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setBigUint64(offset, params.startTime, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setBigUint64(offset, params.netAmountDeposited, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setBigUint64(offset, params.period ?? 1n, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setBigUint64(offset, params.amountPerPeriod ?? params.netAmountDeposited, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setBigUint64(offset, params.cliff ?? params.startTime, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setBigUint64(offset, params.cliffAmount ?? params.netAmountDeposited, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint8(offset, params.cancelableBySender === true ? 1 : 0);
  offset += Uint8Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint8(offset, params.cancelableByRecipient === true ? 1 : 0);
  offset += Uint8Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint8(offset, params.automaticWithdrawal === undefined ? 1 : (params.automaticWithdrawal === true ? 1 : 0));
  offset += Uint8Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint8(offset, params.transferableBySender === true ? 1 : 0);
  offset += Uint8Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint8(offset, params.transferableByRecipient === true ? 1 : 0);
  offset += Uint8Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint8(offset, params.canTopup === true ? 1 : 0);
  offset += Uint8Array.BYTES_PER_ELEMENT;

  const streamNameBytes = new TextEncoder().encode(params.streamName);
  streamflowCreateIxU8a.set(streamNameBytes.slice(0, 64), offset);
  offset += 64;

  streamflowCreateIxDataView.setBigUint64(offset, params.withdrawFrequency ?? 1n, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint32(offset, params.ghost ?? 65537, true);
  offset += Uint32Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint8(offset, params.pausable === true ? 1 : 0);
  offset += Uint8Array.BYTES_PER_ELEMENT;

  streamflowCreateIxDataView.setUint8(offset, params.canUpdateRate === true ? 1 : 0);
  offset += Uint8Array.BYTES_PER_ELEMENT;

  return streamflowCreateIxU8a;
}

/**
 * @param {Uint8Array} streamflowCreateIxU8a
 * @returns {StreamflowCreateInstructionDataObject}
 */
function unpackStreamflowCreateInstructionData(streamflowCreateIxU8a) {
  const streamflowCreateIxDataView = new DataView(streamflowCreateIxU8a.buffer);
  let offset = 0;

  const tag = streamflowCreateIxDataView.getBigUint64(offset, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  if (tag !== STREAM_FLOW_CREATE_IX_TAG) {
    throw new Error(`Invalid tag: ${tag}`);
  }

  const startTime = streamflowCreateIxDataView.getBigUint64(offset, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  const netAmountDeposited = streamflowCreateIxDataView.getBigUint64(offset, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  const period = streamflowCreateIxDataView.getBigUint64(offset, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  const amountPerPeriod = streamflowCreateIxDataView.getBigUint64(offset, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  const cliff = streamflowCreateIxDataView.getBigUint64(offset, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  const cliffAmount = streamflowCreateIxDataView.getBigUint64(offset, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  const cancelableBySender = streamflowCreateIxDataView.getUint8(offset) === 1;
  offset += Uint8Array.BYTES_PER_ELEMENT;

  const cancelableByRecipient = streamflowCreateIxDataView.getUint8(offset) === 1;
  offset += Uint8Array.BYTES_PER_ELEMENT;

  const automaticWithdrawal = streamflowCreateIxDataView.getUint8(offset) === 1;
  offset += Uint8Array.BYTES_PER_ELEMENT;

  const transferableBySender = streamflowCreateIxDataView.getUint8(offset) === 1;
  offset += Uint8Array.BYTES_PER_ELEMENT;

  const transferableByRecipient = streamflowCreateIxDataView.getUint8(offset) === 1;
  offset += Uint8Array.BYTES_PER_ELEMENT;

  const canTopup = streamflowCreateIxDataView.getUint8(offset) === 1;
  offset += Uint8Array.BYTES_PER_ELEMENT;

  const streamName = new TextDecoder('utf-8').decode(streamflowCreateIxU8a.slice(offset, offset + 64));
  offset += 64;

  const withdrawFrequency = streamflowCreateIxDataView.getBigUint64(offset, true);
  offset += BigInt64Array.BYTES_PER_ELEMENT;

  const ghost = streamflowCreateIxDataView.getUint32(offset, true);
  offset += Uint32Array.BYTES_PER_ELEMENT;

  const pausable = streamflowCreateIxDataView.getUint8(offset) === 1;
  offset += Uint8Array.BYTES_PER_ELEMENT;

  const canUpdateRate = streamflowCreateIxDataView.getUint8(offset) === 1;
  offset += Uint8Array.BYTES_PER_ELEMENT;

  return {
    startTime,
    netAmountDeposited,
    period,
    amountPerPeriod,
    cliff,
    cliffAmount,
    cancelableBySender,
    cancelableByRecipient,
    automaticWithdrawal,
    transferableBySender,
    transferableByRecipient,
    canTopup,
    streamName,
    withdrawFrequency,
    ghost,
    pausable,
    canUpdateRate,
  };
}

export const STREAMFLOW_MAINNET_PROGRAM_ID = new PublicKey('strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m');
export const STREAMFLOW_DEVNET_PROGRAM_ID = new PublicKey('HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ');

const STREAMFLOW_TREASURY = new PublicKey('5SEpbdjFK5FxwTvfsGMXVQTD2v4M2c5tyRTxhdsPkgDw');
const STREAMFLOW_WITHDRAWOR = new PublicKey('wdrwhnCv4pzW8beKsbPa4S2UDZrXenjg16KJdKSpb5u');
const STREAMFLOW_ORACLE_FEE = new PublicKey('B743wFVk2pCYhV91cn287e1xY7f1vt4gdY48hhNiuQmT');

/**
 * @typedef {object} StreamflowCreateInstructionParams
 * @property {PublicKey} sender
 * @property {PublicKey} metadata
 * @property {PublicKey} tokenMint
 * @property {StreamflowCreateInstructionDataObject} data
 */

/**
 * @param {PublicKey} programId
 * @param {StreamflowCreateInstructionParams} input
 */
export function createStreamflowCreateInstruction(programId, input) {
  const senderAta = getAssociatedTokenAddressSync(
    input.tokenMint,
    input.sender,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const recipient = input.sender;

  const [escrowToken] = PublicKey.findProgramAddressSync(
    [Uint8Array.from([115, 116, 114, 109]), input.metadata.toBuffer()],
    programId,
  );

  const recipientAta = getAssociatedTokenAddressSync(
    input.tokenMint,
    recipient,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const streamflowTreasuryAta = getAssociatedTokenAddressSync(
    input.tokenMint,
    STREAMFLOW_TREASURY,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const withdraworAta = getAssociatedTokenAddressSync(
    input.tokenMint,
    STREAMFLOW_WITHDRAWOR,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );


  const data = packStreamflowCreateInstructionData(input.data);

  return new TransactionInstruction({
    programId,
    data: Buffer.from(data),
    keys: [
      { pubkey: input.sender, isSigner: true, isWritable: true },
      { pubkey: senderAta, isSigner: false, isWritable: true },
      { pubkey: recipient, isSigner: false, isWritable: true },
      { pubkey: input.metadata, isSigner: true, isWritable: true },
      { pubkey: escrowToken, isSigner: false, isWritable: true },
      { pubkey: recipientAta, isSigner: false, isWritable: true },
      { pubkey: STREAMFLOW_TREASURY, isSigner: false, isWritable: true },
      { pubkey: streamflowTreasuryAta, isSigner: false, isWritable: true },
      { pubkey: STREAMFLOW_WITHDRAWOR, isSigner: false, isWritable: true },
      { pubkey: STREAMFLOW_WITHDRAWOR, isSigner: false, isWritable: true },
      { pubkey: withdraworAta, isSigner: false, isWritable: true },
      { pubkey: input.tokenMint, isSigner: false, isWritable: true },
      { pubkey: STREAMFLOW_ORACLE_FEE, isSigner: false, isWritable: true },
      { pubkey: RENT_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
  });
}

/**
 * @param {Array<PublicKey>} accountPubkeys
 * @param {MessageCompiledInstruction} instruction
 */
export function unpackStreamflowCreateInstruction(accountPubkeys, instruction) {
  const programId = accountPubkeys[instruction.programIdIndex];

  const sender = accountPubkeys[instruction.accountKeyIndexes[0]];
  const senderAta = accountPubkeys[instruction.accountKeyIndexes[1]];
  const recipient = accountPubkeys[instruction.accountKeyIndexes[2]];
  const metadata = accountPubkeys[instruction.accountKeyIndexes[3]];
  const escrowToken = accountPubkeys[instruction.accountKeyIndexes[4]];
  const recipientAta = accountPubkeys[instruction.accountKeyIndexes[5]];
  const streamflowTreasury = accountPubkeys[instruction.accountKeyIndexes[6]];
  const streamflowTreasuryAta = accountPubkeys[instruction.accountKeyIndexes[7]];
  const withdrawor = accountPubkeys[instruction.accountKeyIndexes[8]];
  const withdraworAta = accountPubkeys[instruction.accountKeyIndexes[9]];
  const tokenMint = accountPubkeys[instruction.accountKeyIndexes[10]];
  const streamflowOracleFee = accountPubkeys[instruction.accountKeyIndexes[11]];
  const rent = accountPubkeys[instruction.accountKeyIndexes[12]];
  const associatedTokenProgram = accountPubkeys[instruction.accountKeyIndexes[13]];
  const systemProgram = accountPubkeys[instruction.accountKeyIndexes[14]];

  const data = unpackStreamflowCreateInstructionData(Uint8Array.from(instruction.data));

  return {
    programId,
    sender,
    senderAta,
    recipient,
    metadata,
    escrowToken,
    recipientAta,
    streamflowTreasury,
    streamflowTreasuryAta,
    withdrawor,
    withdraworAta,
    tokenMint,
    streamflowOracleFee,
    rent,
    associatedTokenProgram,
    systemProgram,
    ...data,
  };
}
