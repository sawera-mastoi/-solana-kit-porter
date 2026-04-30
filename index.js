var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var codemod = async (root) => {
  const rootNode = root.root();
  const edits = [];
  const publicKeyConstructors = rootNode.findAll({
    rule: {
      kind: "new_expression",
      has: { field: "constructor", regex: "^PublicKey$" }
    }
  });
  for (const node of publicKeyConstructors) {
    const args = node.field("arguments");
    if (args) edits.push(node.replace(`address${args.text()}`));
  }
  const connectionConstructors = rootNode.findAll({
    rule: {
      kind: "new_expression",
      has: { field: "constructor", regex: "^Connection$" }
    }
  });
  for (const node of connectionConstructors) {
    const args = node.field("arguments");
    if (args) {
      const firstArg = args.text().replace(/^\(|\)$/g, "").split(",")[0].trim();
      edits.push(node.replace(`createSolanaRpc(${firstArg})`));
    }
  }
  const keypairGenerate = rootNode.findAll({
    rule: { pattern: "Keypair.generate()" }
  });
  for (const node of keypairGenerate)
    edits.push(node.replace("await generateKeyPairSigner()"));
  const keypairFromSecret = rootNode.findAll({
    rule: { pattern: "Keypair.fromSecretKey($ARGS)" }
  });
  for (const node of keypairFromSecret) {
    const args = node.getMatch("ARGS");
    if (args)
      edits.push(
        node.replace(`await createKeyPairSignerFromBytes(${args.text()})`)
      );
  }
  const transferCalls = rootNode.findAll({
    rule: {
      kind: "call_expression",
      has: {
        field: "function",
        kind: "member_expression",
        has: { field: "object", regex: "^SystemProgram$" },
        has: { field: "property", regex: "^transfer$" }
      }
    }
  });
  for (const node of transferCalls) {
    const args = node.field("arguments");
    if (args) {
      let argsText = args.text();
      argsText = argsText.replace(/\bfromPubkey\b/g, "source");
      argsText = argsText.replace(/\btoPubkey\b/g, "destination");
      argsText = argsText.replace(/\blamports\b/g, "amount");
      edits.push(node.replace(`getTransferInstruction(${argsText})`));
    }
  }
  const transactionAdds = rootNode.findAll({
    rule: {
      kind: "call_expression",
      has: {
        field: "function",
        kind: "member_expression",
        has: {
          field: "object",
          kind: "new_expression",
          has: { field: "constructor", regex: "^Transaction$" }
        },
        has: { field: "property", regex: "^add$" }
      }
    }
  });
  for (const node of transactionAdds) {
    const args = node.field("arguments");
    if (args) {
      const insts = args.text().replace(/^\(|\)$/g, "");
      edits.push(
        node.replace(
          `pipe(createTransaction({ version: 'legacy' }), (tx) => appendTransactionMessageInstructions([${insts}], tx))`
        )
      );
    }
  }
  const importDeclarations = rootNode.findAll({
    rule: {
      kind: "import_statement",
      has: { field: "source", regex: "@solana/web3\\.js" }
    }
  });
  for (const node of importDeclarations) {
    let importText = node.text();
    const replacements = [
      [/\bPublicKey\b/g, "address, type Address"],
      [/\bConnection\b/g, "createSolanaRpc"],
      [
        /\bTransaction\b/g,
        "pipe, createTransaction, appendTransactionMessageInstructions"
      ],
      [/\bSystemProgram\b/g, "getTransferInstruction"],
      [/\bKeypair\b/g, "generateKeyPairSigner, createKeyPairSignerFromBytes"],
      [/\bLAMPORTS_PER_SOL\b/g, "LAMPORTS_PER_SOL"],
      [/@solana\/web3\.js/g, "@solana/kit"]
    ];
    replacements.forEach(
      ([from, to]) => importText = importText.replace(from, to)
    );
    importText = importText.replace(/,\s*,/g, ",").replace(/,\s*}/g, " }");
    edits.push(node.replace(importText));
  }
  const rpcCalls = rootNode.findAll({
    rule: {
      kind: "call_expression",
      has: {
        field: "function",
        kind: "member_expression",
        has: {
          field: "property",
          regex: "^(getBalance|getMinimumBalanceForRentExemption|getLatestBlockhash)$"
        }
      }
    }
  });
  for (const node of rpcCalls) {
    if (node.parent()?.kind() !== "await_expression")
      edits.push(node.replace(`await ${node.text()}.send()`));
    else edits.push(node.replace(`${node.text()}.send()`));
  }
  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};
var index_default = codemod;
