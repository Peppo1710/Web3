import React, { useState } from 'react';
import * as bip39 from 'bip39';
import { generateEthereumWallet } from '../utils/eth';
import { generateSolanaWallet } from '../utils/sol';
// import { generateBitcoinWallet } from '../utils/bitcoin';

const Home = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [ethIndex, setEthIndex] = useState(0);
  const [solIndex , setSolIndex] = useState(0);

  const walletsList = [
    { name: 'Solana', key: 'Solana' },
    { name: 'Ethereum', key: 'Ethereum' },
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
        wallet = await generateSolanaWallet(mnemonic, solIndex, setSolIndex); // TODO: implement this
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
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>🔐 HD Wallet Generator</h1>
        <p>Generate wallets from a single seed phrase</p>
      </div>

      <div className="main-content">
        {/* Mnemonic Section */}
        <div className="card mnemonic-section">
          <div className="card-header">
            <h2 className="card-title">Seed Phrase</h2>
          </div>
          <textarea
            value={mnemonic}
            readOnly
            className="mnemonic-textarea"
            placeholder="Generate a 12-word mnemonic phrase to get started"
          />
          <button onClick={generateMnemonic} className="btn btn-primary">
            Generate 12-word Phrase
          </button>
        </div>

        {/* Wallet Type Grid */}
        <div className="wallet-grid">
          {walletsList.map((wallet) => (
            <div
              key={wallet.key}
              className={`wallet-card ${selectedWallet === wallet.key ? 'selected' : ''}`}
            >
              <h2>{wallet.name}</h2>
              <button
                onClick={() => {
                  setSelectedWallet(wallet.key);
                  handleGenerateWallet(wallet.key);
                }}
                className="btn btn-secondary"
              >
                Add {wallet.name} Wallet
              </button>
            </div>
          ))}
        </div>

        {/* Selected Wallet Info */}
        {selectedWallet && (
          <div className="status-indicator">
            <span className="icon">✅</span>
            <strong>Latest Selected Wallet Type:</strong> {selectedWallet}
          </div>
        )}

        {/* Wallet Display */}
        {wallets.length > 0 && (
          <div className="wallet-display">
            <h2>📦 Generated Wallets</h2>
            <div className="wallet-grid-display">
              {wallets.map((w, idx) => (
                <div key={idx} className="wallet-item fade-in">
                  <h3>{w.type} Wallet</h3>
                  <div className="wallet-detail">
                    <strong>Address</strong>
                    <p>{w.address}</p>
                  </div>
                  <div className="wallet-detail">
                    <strong>Public Key</strong>
                    <p>{w.publicKey}</p>
                  </div>
                  <div className="wallet-detail">
                    <strong>Private Key</strong>
                    <p>{w.privateKey}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
