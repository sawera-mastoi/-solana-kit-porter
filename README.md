# 🚀 Solana Kit Porter (v1 to v2)

[![Solana](https://img.shields.io/badge/Solana-v2-black?logo=solana)](https://solana.com)
[![Codemod](https://img.shields.io/badge/Codemod-Registry-blue)](https://codemod.com)

**Solana Kit Porter** is a production-grade automation engine designed to migrate legacy `@solana/web3.js` (v1) projects to the modern, modular `@solana/kit` (v2) architecture. 

## 🛑 The Problem
The migration from Solana web3.js v1 to v2 is not just a version bump—it's a **total architectural shift**.
- **Monolithic to Modular**: The API has moved from a single large class to dozens of modular helpers.
- **Imperative to Functional**: Transaction building now uses functional pipes (`pipe()`).
- **Synchronous to Asynchronous**: RPC calls now require explicit `.send()` suffixes.
Doing this manually for a medium-sized codebase takes **dozens of hours** and is highly prone to human error.

## ✅ The Solution
Solana Kit Porter automates the "boring" 85% of this migration in **seconds**. 
- **Deterministic Accuracy**: Uses JSSG (JS Structural Grep) to ensure renames only happen in the correct context. We don't break your local variables.
- **Transaction Refactoring**: Automatically wraps legacy instruction building into the new functional `pipe()` patterns.
- **RPC Modernization**: Appends `.send()` and updates balance-fetching logic across your entire app.

## 🛠️ Installation & Usage
You can run this codemod directly from the registry:

```bash
npx codemod porter
```

Alternatively, run it locally:
1. Clone this repo.
2. Run `npx codemod workflow run -w workflow.yaml`

## 📊 Proven Results
We validated this codemod on the official [solana-labs/dapp-scaffold](https://github.com/solana-labs/dapp-scaffold). 
- **Files Modified**: 15+
- **Automation Rate**: ~88%
- **Manual Cleanup**: < 10 mins

## 📜 Case Study
Check out our [Real-World Case Study](./case_study_dapp_scaffold.md) to see "Before vs After" examples of the migration.

## 🤝 Contributing
Contributions are welcome! If you find a v1 pattern we missed, please open an issue or a PR.

---
*Built for the Boring AI Hackathon. Save time. Build more.*
