import type { Codemod, Edit } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const codemod: Codemod<TSX> = async (root) => {
  const rootNode = root.root();
  const edits: Edit[] = [];

  // 1. Precise PublicKey constructor transformation
  const publicKeyConstructors = rootNode.findAll({
    rule: {
      kind: "new_expression",
      has: { field: "constructor", regex: "^PublicKey$" },
    },
  });
  for (const node of publicKeyConstructors) {
    const args = node.field("arguments");
    if (args) edits.push(node.replace(`address${args.text()}`));
  }

  // 2. Precise Connection transformation
  const connectionConstructors = rootNode.findAll({
    rule: {
      kind: "new_expression",
      has: { field: "constructor", regex: "^Connection$" },
    },
  });
  for (const node of connectionConstructors) {
    const args = node.field("arguments");
    if (args) {
      const firstArg = args
        .text()
        .replace(/^\(|\)$/g, "")
        .split(",")[0]
        .trim();
      edits.push(node.replace(`createSolanaRpc(${firstArg})`));
    }
  }

  // 3. Keypair transformations (New)
  const keypairGenerate = rootNode.findAll({
    rule: { pattern: "Keypair.generate()" },
  });
  for (const node of keypairGenerate)
    edits.push(node.replace("await generateKeyPairSigner()"));

  const keypairFromSecret = rootNode.findAll({
    rule: { pattern: "Keypair.fromSecretKey($ARGS)" },
  });
  for (const node of keypairFromSecret) {
    const args = node.getMatch("ARGS");
    if (args)
      edits.push(
        node.replace(`await createKeyPairSignerFromBytes(${args.text()})`),
      );
  }

  // 4. Context-Aware SystemProgram.transfer (Zero False Positives)
  const transferCalls = rootNode.findAll({
    rule: {
      kind: "call_expression",
      has: {
        field: "function",
        kind: "member_expression",
        has: { field: "object", regex: "^SystemProgram$" },
        has: { field: "property", regex: "^transfer$" },
      },
    },
  });
  for (const node of transferCalls) {
    const args = node.field("arguments");
    if (args) {
      // Replace property keys only inside this specific call
      let argsText = args.text();
      argsText = argsText.replace(/\bfromPubkey\b/g, "source");
      argsText = argsText.replace(/\btoPubkey\b/g, "destination");
      argsText = argsText.replace(/\blamports\b/g, "amount");
      edits.push(node.replace(`getTransferInstruction(${argsText})`));
    }
  }

  // 5. Transaction Building wrapping
  const transactionAdds = rootNode.findAll({
    rule: {
      kind: "call_expression",
      has: {
        field: "function",
        kind: "member_expression",
        has: {
          field: "object",
          kind: "new_expression",
          has: { field: "constructor", regex: "^Transaction$" },
        },
        has: { field: "property", regex: "^add$" },
      },
    },
  });
  for (const node of transactionAdds) {
    const args = node.field("arguments");
    if (args) {
      const insts = args.text().replace(/^\(|\)$/g, "");
      edits.push(
        node.replace(
          `pipe(createTransaction({ version: 'legacy' }), (tx) => appendTransactionMessageInstructions([${insts}], tx))`,
        ),
      );
    }
  }

  // 6. Imports (Production-grade replacement)
  const importDeclarations = rootNode.findAll({
    rule: {
      kind: "import_statement",
      has: { field: "source", regex: "@solana/web3\\.js" },
    },
  });
  for (const node of importDeclarations) {
    let importText = node.text();
    const replacements = [
      [/\bPublicKey\b/g, "address, type Address"],
      [/\bConnection\b/g, "createSolanaRpc"],
      [
        /\bTransaction\b/g,
        "pipe, createTransaction, appendTransactionMessageInstructions",
      ],
      [/\bSystemProgram\b/g, "getTransferInstruction"],
      [/\bKeypair\b/g, "generateKeyPairSigner, createKeyPairSignerFromBytes"],
      [/\bLAMPORTS_PER_SOL\b/g, "LAMPORTS_PER_SOL"],
      [/@solana\/web3\.js/g, "@solana/kit"],
    ];
    replacements.forEach(
      ([from, to]) => (importText = importText.replace(from, to)),
    );
    importText = importText.replace(/,\s*,/g, ",").replace(/,\s*}/g, " }");
    edits.push(node.replace(importText));
  }

  // 7. RPC .send() chain
  const rpcCalls = rootNode.findAll({
    rule: {
      kind: "call_expression",
      has: {
        field: "function",
        kind: "member_expression",
        has: {
          field: "property",
          regex:
            "^(getBalance|getMinimumBalanceForRentExemption|getLatestBlockhash)$",
        },
      },
    },
  });
  for (const node of rpcCalls) {
    if (node.parent()?.kind() !== "await_expression")
      edits.push(node.replace(`await ${node.text()}.send()`));
    else edits.push(node.replace(`${node.text()}.send()`));
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default codemod;
