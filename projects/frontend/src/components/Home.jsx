import React, { useState } from 'react';
import * as bip39 from 'bip39';
import { generateEthereumWallet } from '../utils/eth';
// import { generateSolanaWallet } from '../utils/solana';
// import { generateBitcoinWallet } from '../utils/bitcoin';

const Home = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [ethIndex, setEthIndex] = useState(0);


  const walletsList = [
    { name: 'Solana', key: 'Solana' },
    { name: 'Ethereum', key: 'Ethereum' },
    { name: 'Bitcoin', key: 'Bitcoin' },
  ];

  const generateMnemonic = () => {
    const mnemo = bip39.generateMnemonic();
    setMnemonic(mnemo);
    setWallets([]); // reset generated wallets on new phrase
  };

  const handleGenerateWallet = async (flag) => {
    if (!mnemonic) {
      alert("Please generate a mnemonic phrase first.");
      return;
    }

    try {
      let wallet;

      if (flag === 'Ethereum') {
        wallet = await generateEthereumWallet(mnemonic,ethIndex,setEthIndex);
      } else if (flag === 'Solana') {
        wallet = await generateSolanaWallet(mnemonic); // TODO: implement this
      } else if (flag === 'Bitcoin') {
        wallet = await generateBitcoinWallet(mnemonic); // TODO: implement this
      }

      if (wallet) {
        setWallets((prev) => [...prev, { ...wallet, type: flag }]);
      }
    } catch (error) {
      console.error('Wallet Generation Error:', error.message);
      alert('Something went wrong: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h1>🔐 HD Wallet Generator</h1>
      <p>Generate wallets from a single seed phrase</p>

      {/* Mnemonic Area */}
      <textarea
        value={mnemonic}
        readOnly
        rows={2}
        style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
        placeholder="Mnemonic will appear here"
      />
      <button onClick={generateMnemonic} style={{ marginBottom: '20px' }}>
        Generate 12-word Phrase
      </button>

      {/* Wallet Type Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        {walletsList.map((wallet) => (
          <div
            key={wallet.key}
            style={{
              border: selectedWallet === wallet.key ? '2px solid #007bff' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <h2>{wallet.name}</h2>
            <button
              onClick={() => {
                setSelectedWallet(wallet.key);
                handleGenerateWallet(wallet.key);
              }}
            >
              Add {wallet.name} Wallet
            </button>
          </div>
        ))}
      </div>

      {/* Selected Wallet Info */}
      {selectedWallet && (
        <div style={{ marginTop: '20px' }}>
          <strong>✅ Latest Selected Wallet Type:</strong> {selectedWallet}
        </div>
      )}

      {/* Wallet Cards */}
      <h2 style={{ marginTop: '40px' }}>📦 Generated Wallets</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {wallets.map((w, idx) => (
          <div
            key={idx}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              wordWrap: 'break-word',
            }}
          >
            <h3>{w.type} Wallet</h3>
            <p><strong>Address:</strong><br /> {w.address}</p>
            <p><strong>Public Key:</strong><br /> {w.publicKey}</p>
            <p><strong>Private Key:</strong><br /> {w.privateKey}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
