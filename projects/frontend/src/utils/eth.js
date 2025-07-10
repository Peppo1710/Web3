import { HDNodeWallet, Mnemonic } from 'ethers';



export function generateEthereumWallet(mnemonic,ethIndex, setEthIndex) {
  try {
    const phrase = Mnemonic.fromPhrase(mnemonic); // validate + parse

    const hdNode = HDNodeWallet.fromMnemonic(phrase, `m/44'/60'/0'/0/${ethIndex}`);


    setEthIndex(ethIndex+1);
    return {
      address: hdNode.address,
      publicKey: hdNode.publicKey,
      privateKey: hdNode.privateKey,
    };
  } catch (err) {
    console.error(err);
    throw new Error('Invalid mnemonic or derivation failed.');
  }
}
