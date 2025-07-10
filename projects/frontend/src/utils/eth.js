import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { keccak256, privateToPublic } from 'ethereumjs-util';

const bip32 = BIP32Factory(ecc);

export async function generateEthereumWallet(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  // Generates Uint8Array (works fine)
  const seedUint8 = await bip39.mnemonicToSeed(mnemonic); // returns Uint8Array in some setups

  // Create bip32 node directly with Uint8Array
  const root = bip32.fromSeed(new Uint8Array(seedUint8));

  const child = root.derivePath("m/44'/60'/0'/0/0");

  const privateKey = child.privateKey;
  if (!privateKey) throw new Error('No private key found');

  const publicKey = privateToPublic(privateKey);
  const addressBytes = keccak256(publicKey).slice(-20);
  const address = '0x' + Array.from(addressBytes).map(x => x.toString(16).padStart(2, '0')).join('');

  return {
    address,
    publicKey: Array.from(publicKey).map(x => x.toString(16).padStart(2, '0')).join(''),
    privateKey: Array.from(privateKey).map(x => x.toString(16).padStart(2, '0')).join('')
  };
}
