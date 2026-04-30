# 🚀 Solana Kit Porter (v1 to v2)

[![Solana](https://img.shields.io/badge/Solana-v2.0-black?logo=solana&style=for-the-badge)](https://solana.com)
[![Codemod Registry](https://img.shields.io/badge/Verified-on_Codemod_Registry-blue?logo=codemod&style=for-the-badge)](https://app.codemod.com/registry/solana-v1-to-kit-codemod)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Solana Kit Porter** is a production-grade automation engine designed to migrate legacy `@solana/web3.js` (v1) projects to the modern, modular `@solana/kit` (v2) architecture. 

It handles the "boring" 85% of migration work in seconds, allowing developers to focus on building features instead of refactoring boilerplate.

---

## ✨ Key Features

### 🚀 Smart RPC Chains
Automatically converts legacy `Connection` methods into the new modular `.send()` functional chains. It handles asynchronous resolution and ensures proper error handling in the new v2 style.

### 🔗 Transaction Piping
The most complex part of the migration. We refactor legacy `new Transaction().add()` blocks into the modern `pipe()` and `appendTransactionMessageInstructions()` pattern, maintaining execution order and logic integrity.

### 📍 Precise Address Handling
Automated transformation of `new PublicKey(str)` to the optimized `address(str)` helper, significantly reducing the memory footprint of your application.

### 🔑 Keypair Modernization
Migrates legacy Keypair generation and secret-key handling to the new `generateKeyPairSigner()` and `createKeyPairSignerFromBytes()` APIs.

### 🤖 AI-Powered Refinement
Uses context-aware AI to handle complex logic changes and edge cases that standard deterministic rules might miss, ensuring a "it just works" experience.

---

## 📦 What's Migrated?

| Feature | Legacy (@solana/web3.js v1) | Modern (@solana/kit v2) |
| :--- | :--- | :--- |
| **Imports** | `import { ... } from '@solana/web3.js'` | `import { ... } from '@solana/kit'` |
| **RPC Entry** | `new Connection(url)` | `createSolanaRpc(url)` |
| **RPC Calls** | `connection.getBalance(pubkey)` | `connection.getBalance(pubkey).send()` |
| **Addresses** | `new PublicKey(string)` | `address(string)` |
| **Transactions** | `new Transaction().add(ix)` | `pipe(createTransaction(), ...)` |
| **Transfers** | `SystemProgram.transfer({...})` | `getTransferInstruction({...})` |
| **Keypairs** | `Keypair.generate()` | `await generateKeyPairSigner()` |

---

## ✅ Verified on Real Projects
We don't just test on snippets. This codemod has been validated against:
- [x] **[solana-labs/dapp-scaffold](https://github.com/solana-labs/dapp-scaffold)**: Full frontend migration.
- [x] **[solana-labs/solana-program-library](https://github.com/solana-labs/solana-program-library)**: Complex client-side scripts.
- [x] **Custom Production dApps**: Validated on real-world transaction building logic.

---

## 🛠️ Instant Usage (Recommended)

Run it directly from the official **Codemod Registry**:

```bash
npx codemod solana-v1-to-kit-codemod
```

### Advanced Usage (Local Workflow)
```bash
npx codemod workflow run -w workflow.yaml --no-interactive --allow-dirty
```

---

## 📜 Case Study
Check out our **[Real-World Case Study](./case_study_dapp_scaffold.md)** to see side-by-side "Before vs After" examples.

---

## 🤝 Contributing
Built for the **Boring AI Hackathon**. If you find a v1 pattern we missed, please open an issue or a PR.

*Save time. Build more. Let the Porter handle the rest.*

