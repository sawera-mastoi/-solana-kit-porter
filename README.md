# 🏗️ Solana Kit Porter (v1 → v2)

[![Codemod Registry](https://img.shields.io/badge/Codemod-Registry-blue.svg)](https://codemod.com/registry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Automate your migration from the legacy `@solana/web3.js` (v1.x) to the modular, high-performance `@solana/kit` (v2.x).**

The Solana SDK has undergone a massive architectural shift. Manual migration is tedious and error-prone. **Solana Kit Porter** handles the heavy lifting, refactoring your RPC calls, transaction building logic, and address handling in seconds.

---

## ✨ Features

- **🚀 Smart RPC Chains**: Converts `Connection` methods into the new modular `.send()` functional chains.
- **🔗 Transaction Piping**: Automatically refactors `new Transaction().add()` into the modern `pipe()` and `appendTransactionMessageInstructions()` pattern.
- **📍 Address Handling**: Precise transformation of `new PublicKey(str)` to the optimized `address(str)` helper.
- **🔑 Keypair Modernization**: Migrates legacy Keypair generation to the new `generateKeyPairSigner()` and `createKeyPairSignerFromBytes()` APIs.
- **🤖 AI-Powered Refinement**: Uses context-aware AI to handle complex logic changes that deterministic rules might miss.

---

## 🛠️ Quick Start

Ensure you have the [Codemod CLI](https://docs.codemod.com/) installed. Then, run this command in your project root:

```bash
npx codemod workflow run -w workflow.yaml --no-interactive --allow-dirty
```

---

## 🧪 Verified on Real Projects

We have successfully tested this codemod on:
- [x] `solana-labs/dapp-scaffold`
- [x] `solana-labs/solana-program-library` (Client-side scripts)
- [x] Custom production dApps

---

## 📦 What's Migrated?

| Feature | Legacy (v1) | Modern (v2) |
| :--- | :--- | :--- |
| **Imports** | `@solana/web3.js` | `@solana/kit` |
| **RPC** | `new Connection(url)` | `createSolanaRpc(url)` |
| **Calls** | `connection.getBalance(pubkey)` | `connection.getBalance(pubkey).send()` |
| **Addresses** | `new PublicKey(str)` | `address(str)` |
| **Transactions** | `new Transaction().add(ix)` | `pipe(createTransaction(), ...)` |
| **Transfers** | `SystemProgram.transfer({...})` | `getTransferInstruction({...})` |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the <b>Boring AI Hackathon</b>
</p>
