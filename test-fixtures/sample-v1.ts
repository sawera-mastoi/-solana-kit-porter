import {
  createSolanaRpc,
  address,
  type Address,
  getTransferInstruction,
  pipe,
  createTransaction,
  appendTransactionMessageInstructions,
} from "@solana/kit";

async function run() {
  const connection = createSolanaRpc("https://api.mainnet-beta.solana.com");
  // fromPubkey should NOT be renamed to source here (Variable declaration)
  const fromPubkey = address("11111111111111111111111111111111");
  const toPubkey = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

  const balance = await connection.getBalance(fromPubkey).send();
  console.log(`Balance: ${balance}`);

  const tx = pipe(createTransaction({ version: "legacy" }), (tx) =>
    appendTransactionMessageInstructions(
      [
        SystemProgram.transfer({
          fromPubkey, // Should be renamed to source
          toPubkey, // Should be renamed to destination
          lamports: 1000, // Should be renamed to amount
        }),
      ],
      tx,
    ),
  );
}
