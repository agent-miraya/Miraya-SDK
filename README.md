## Lit Wrapper SDK

Using Lit has never been easier before

## Installation

```bash
npm install lit-wrapper-sdk
```

## Examples

Using Lit to create a Solana Key and Send a Txn with it, a Ethereum private key works as an auth method for generating signatures with newly created Solana Key

```js
import { LitWrapper } from "../lit.js";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev")

async function generateSolanaWallet() {
    const response = await litWrapper.createSolanaWK(process.env.ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response.generatedPublicKey)
    const txn = await litWrapper.sendSolanaWKTxn(response, process.env.ETHEREUM_PRIVATE_KEY, false)
    console.log("Signed Transaction", txn)
}
generateSolanaWallet()
```