// build.js
import { build } from 'esbuild';

build({
  entryPoints: ['src/index.js'], // ubah jika file masuknya bukan ini
  bundle: true,
  outfile: 'dist/index.js',
  platform: 'node',
  format: 'esm',
  target: ['esnext'],
  sourcemap: true,
  minify: true,
  external: [
    // agar tidak ikut dibundle
    '@solana/web3.js',
    '@solana/spl-token',
    '@web3auth/sign-in-with-solana',
    '@raydium-io/raydium-sdk-v2',
    'axios',
    'ethers',
    'siwe',
    'tweetnacl',
    'bs58',
    'mime-detect',
    'viem',
    'web3',
    'ws'
  ],
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
