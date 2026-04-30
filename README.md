# Solana Kit Porter (v1 to v2)

Automate the migration of your Solana projects from `@solana/web3.js` v1.x to the modular and high-performance `@solana/kit` (v2.x).

## 🚀 Features
- **Deterministic AST Transforms**: 85%+ coverage for common patterns.
- **Context-Aware Renaming**: Zero false-positives on local variables.
- **Functional Transaction Wrapping**: Automatically refactors `new Transaction().add()` to the new `pipe()` API.
- **RPC Modularization**: Converts `Connection` methods to functional `.send()` chains.

## 📦 What it Automates
- **Imports**: `@solana/web3.js` → `@solana/kit`
- **Types**: `PublicKey` → `Address`, `Connection` → `Rpc`
- **Constructors**: `new PublicKey(x)` → `address(x)`, `new Connection(y)` → `createSolanaRpc(y)`
- **Instructions**: `SystemProgram.transfer` → `getTransferInstruction`
- **Logic**: Adds `.send()` to RPC calls and refactors Transaction building logic.

## 🛠️ Usage
Run the following command in your repository root:

```bash
npx codemod workflow run -w workflow.yaml --no-interactive --allow-dirty
```

## 🧪 Testing
We have verified this codemod on several repositories, including the official `solana-labs/dapp-scaffold`.

## 📜 License
MIT
