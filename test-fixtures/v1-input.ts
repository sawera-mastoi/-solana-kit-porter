import {
  createSolanaRpc,
  address,
  type Address,
  pipe,
  createTransaction,
  appendTransactionMessageInstructions,
  getTransferInstruction,
  generateKeyPairSigner,
  createKeyPairSignerFromBytes,
  LAMPORTS_PER_SOL,
} from "@solana/kit";

async function run() {
  const connection = createSolanaRpc("https://api.mainnet-beta.solana.com");
  const fromPubkey = address("11111111111111111111111111111111");
  const toPubkey = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

  // Fetch balance
  const balance = await connection.getBalance(fromPubkey).send();
  console.log(`Balance: ${balance}`);

  // Create transaction (legacy)
  const transaction = pipe(createTransaction({ version: "legacy" }), (tx) =>
    appendTransactionMessageInstructions(
      [
        SystemProgram.transfer({
          fromPubkey: fromPubkey,
          toPubkey: toPubkey,
          lamports: 1000,
        }),
      ],
      tx,
    ),
  );

  // Keypair generation
  const keypair = await generateKeyPairSigner();
  console.log("New keypair generated");

  const minBalance = await connection
    .getMinimumBalanceForRentExemption(100)
    .send();
  console.log(`Min balance: ${minBalance}`);
}
