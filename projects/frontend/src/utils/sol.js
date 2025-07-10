import * as bip39 from 'bip39';
import * as ed25519 from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';

export async function generateSolanaWallet(mnemonic, solIndex, setSolIndex) {
  try {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic');
    }

    const seed = await bip39.mnemonicToSeed(mnemonic); // Returns Buffer
    const derivationPath = `m/44'/501'/${solIndex}'/0'`;

    const derivedSeed = ed25519.derivePath(derivationPath, seed.toString('hex')).key;

    const keypair = Keypair.fromSeed(derivedSeed);

    // Increment solana index
    setSolIndex(solIndex + 1);

    return {
      address: keypair.publicKey.toBase58(),
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex').slice(0, 64), // Only 32 bytes
    };
  } catch (err) {
    console.error('Solana wallet generation failed:', err);
    throw new Error('Solana derivation failed.');
  }
}
