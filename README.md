## Lit Wrapper SDK

Using Lit Network has never been easier before
</br> An Ethereum private key is used to send requests to the Lit Network. Fund your wallet with a [faucet](https://chronicle-yellowstone-faucet.getlit.dev/) on Lit's custom rollup chain.

## Quickview

```bash
npm install lit-wrapper-sdk
```

Generates a Solana key and sends a prompt to the Solana-agent-kit (This kit runs inside Lit's TEE)

```js
async function executeSolanaAgentKit() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    const agentKitResponse = await litWrapper.executeSolanaAgentKit({
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        MESSAGE: "What is my sol balance?",
        RPC_URL: "https://api.devnet.solana.com",
        OPENAI_API_KEY: process.env.OPEN_AI_API_KEY!,
        pkp: response?.pkpInfo!,
        wk: response?.wkInfo!,
    });
    console.log(agentKitResponse);
}
```

Checks against a conditional logic and only creates signatures for a specified transaction when the condition is satisfies

```js
async function createLitActionAndSignSolanaTxn() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response?.wkInfo.generatedPublicKey);

    const conditionLogic = `
    const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
    const resp = await fetch(url).then((response) => response.json());
    const temp = resp.properties.periods[0].temperature;

    console.log(temp);

    // only sign if the temperature is below 60
    if (temp < 60) {
        createSignatureWithAction();
    }`;

    const txn = await litWrapper.createSerializedLitTxn({
        wk: response?.wkInfo,
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        amount: 0.004 * Math.pow(10, 9),
        network: "mainnet-beta",
        flag: FlagForLitTxn.SOL,
    });

    const checkResult = await litWrapper.conditionalSigningOnSolana({
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        litTransaction: txn,
        conditionLogic,
        broadcastTransaction: true,
        wk: response?.wkInfo,
        pkp: response?.pkpInfo,
    });
    console.log(checkResult);
}
```

## API/Method References

### `LitWrapper` Class

#### Constructor
```typescript
constructor(litNetwork: LIT_NETWORKS_KEYS)
```
- Initializes a new instance of the `LitWrapper` class.
- **Parameters:**
  - `litNetwork`: The Lit network key.

#### Auth Methods

##### `checkPermits`
```typescript
async checkPermits(pkpTokenId: string): Promise<{ actions: any[], authMethods: any[], addresses: any[] }>
```
- Checks the permits of a PKP.
- **Parameters:**
  - `pkpTokenId`: The PKP token ID.
- **Returns:** An object containing the permitted actions, auth methods, and addresses.

##### `addAuthAddress`
```typescript
async addAuthAddress(userPrivateKey: string, pkpTokenId: string, ethAddress: string): Promise<any>
```
- Adds an authorized address to a PKP.
- **Parameters:**
  - `userPrivateKey`: The user's private key.
  - `pkpTokenId`: The PKP token ID.
  - `ethAddress`: The Ethereum address to authorize.
- **Returns:** The response from the Lit network.

##### `removeAuthAddress`
```typescript
async removeAuthAddress(userPrivateKey: string, pkpTokenId: string, ethAddress: string): Promise<any>
```
- Adds an authorized address to a PKP.
- **Parameters:**
  - `userPrivateKey`: The user's private key.
  - `pkpTokenId`: The PKP token ID.
  - `ethAddress`: The Ethereum address to authorize.
- **Returns:** The response from the Lit network.

##### `addPermittedAction`
```typescript
async addPermittedAction(params: AddPermittedActionParams): Promise<{ ipfsCID: string, response: any }>
```
- Adds a permitted action to a PKP.
- **Parameters:**
  - `params`: An object containing `userPrivateKey`, `pkpTokenId`, `litActionCode`, and `pinataAPIKey`.
- **Returns:** An object containing the IPFS CID and the response.

##### `removePermittedAction`
```typescript
async removePermittedAction(params: RemovePermittedActionParams): Promise<{ ipfsCID: string, response: any }>
```
- Adds a permitted action to a PKP.
- **Parameters:**
  - `params`: An object containing `userPrivateKey`, `pkpTokenId`, `litActionCode`, and `pinataAPIKey`.
- **Returns:** An object containing the IPFS CID and the response.


#### Solana Methods

##### `createSolanaWK`
```typescript
async createSolanaWK(userPrivateKey: string): Promise<{ pkpInfo: PKP, wkInfo: WK }>
```
- Creates a Solana Wrapped Key (WK).
- **Parameters:**
  - `userPrivateKey`: The user's private key.
- **Returns:** An object containing the PKP and WK information.

##### `getConditionalLitAction`
```typescript
async getConditionalLitAction(conditionalLogic: string): Promise<string>
```
- Gets a conditional Lit action.
- **Parameters:**
  - `conditionalLogic`: The conditional logic.
- **Returns:** The conditional Lit action.

##### `conditionalSigningOnSolana`
```typescript
async conditionalSigningOnSolana(params: ConditionalSigningOnSolanaParams): Promise<any>
```
- Performs conditional signing on Solana.
- **Parameters:**
  - `params`: An object containing `userPrivateKey`, `litTransaction`, `broadcastTransaction`, `conditionalLogic`, `pkp`, `wk`, and `params`.
- **Returns:** The result of the conditional signing.

##### `executeCustomActionOnSolana`
```typescript
async executeCustomActionOnSolana(params: ExecuteCustomActionOnSolanaParams): Promise<any>
```
- Executes a custom action on Solana.
- **Parameters:**
  - `params`: An object containing `userPrivateKey`, `litActionCode`, `pkp`, `wk`, and `params`.
- **Returns:** The result of the executed action.

##### `executeSolanaAgentKit`
```typescript
async executeSolanaAgentKit(params: ExecuteSolanaAgentKitParams): Promise<any>
```
- Executes the Solana Agent Kit.
- **Parameters:**
  - `params`: An object containing `userPrivateKey`, `MESSAGE`, `RPC_URL`, `OPENAI_API_KEY`, `pkp`, and `wk`.
- **Returns:** The result of the executed action.

##### `sendSolanaWKTxnWithSol`
```typescript
async sendSolanaWKTxnWithSol(params: SendSolanaWKTxnWithSolParams): Promise<any>
```
- Sends a Solana WK transaction with SOL.
- **Parameters:**
  - `params`: An object containing `amount`, `toAddress`, `network`, `broadcastTransaction`, `userPrivateKey`, `wk`, and `pkp`.
- **Returns:** The signed transaction.

##### `sendSolanaWKTxnWithCustomToken`
```typescript
async sendSolanaWKTxnWithCustomToken(params: SendSolanaWKTxnWithCustomTokenParams): Promise<any>
```
- Sends a Solana WK transaction with a custom token.
- **Parameters:**
  - `params`: An object containing `tokenMintAddress`, `amount`, `toAddress`, `network`, `broadcastTransaction`, `userPrivateKey`, `wk`, and `pkp`.
- **Returns:** The signed transaction.

##### `createSerializedLitTxn`
```typescript
async createSerializedLitTxn(params: CreateSerializedLitTxnParams): Promise<any>
```
- Creates a serialized Lit transaction.
- **Parameters:**
  - `params`: An object containing `toAddress`, `amount`, `network`, `flag`, `tokenMintAddress`, and `wk`.
- **Returns:** The serialized transaction.

#### Util Methods

##### `createPKP`
```typescript
async createPKP(userPrivateKey: string): Promise<PKP | undefined>
```
- Creates a PKP (Programmable Key Pair).
- **Parameters:**
  - `userPrivateKey`: The user's private key.
- **Returns:** The created PKP.

##### `createPKPWithLitAction`
```typescript
async createPKPWithLitAction(params: CreatePKPWithLitActionParams): Promise<{ pkp: PKP, ipfsCID: string }>
```
- Creates a PKP and adds a permitted action.
- **Parameters:**
  - `params`: An object containing `userPrivateKey`, `litActionCode`, and `pinataAPIKey`.
- **Returns:** An object containing the created PKP and the IPFS CID.

##### `createPKPSessionSigs`
```typescript
async createPKPSessionSigs(userPrivateKey: string, pkpPublicKey: string): Promise<any>
```
- Creates session signatures for a PKP.
- **Parameters:**
  - `userPrivateKey`: The user's private key.
  - `pkpPublicKey`: The PKP public key.
- **Returns:** The session signatures.

##### `getSessionSigs`
```typescript
async getSessionSigs(userPrivateKey: string, pkpPublicKey: string, type: string): Promise<any>
```
- Gets session signatures.
- **Parameters:**
  - `userPrivateKey`: The user's private key.
  - `pkpPublicKey`: The PKP public key.
  - `type`: The type of session.
- **Returns:** The session signatures.

##### `executeLitAction`
```typescript
async executeLitAction(params: ExecuteLitActionParams): Promise<any>
```
- Executes a Lit action.
- **Parameters:**
  - `params`: An object containing `userPrivateKey`, `pkpPublicKey`, `litActionIpfsCid`, `litActionCode`, and `params`.
- **Returns:** The result of the executed action.

##### `getDecipheringDetails`
```typescript
async getDecipheringDetails(params: GetDecipheringDetailsParams): Promise<{ ciphertext: string, dataToEncryptHash: string }>
```
- Gets deciphering details.
- **Parameters:**
  - `params`: An object containing `userPrivateKey`, `pkp`, and `wk`.
- **Returns:** An object containing the ciphertext and data to encrypt the hash.

##### `uploadViaPinata`
```typescript
async uploadViaPinata(params: UploadViaPinataParams): Promise<string>
```
- Uploads a file to Pinata.
- **Parameters:**
  - `params`: An object containing `pinataAPIKey` and `litActionCode`.
- **Returns:** The IPFS hash of the uploaded file.

### `LitTester` Class

#### Constructor
```typescript
constructor(userPrivateKey: string, litNetwork: LIT_NETWORKS_KEYS)
```
- Initializes a new instance of the `LitTester` class.
- **Parameters:**
  - `userPrivateKey`: The user's private key.
  - `litNetwork`: The Lit network key.

#### Methods

##### `init`
```typescript
static async init(userPrivateKey: string, litNetwork: LIT_NETWORKS_KEYS): Promise<LitTester>
```
- Initializes a new instance of the `LitTester` class and initializes the PKP.
- **Parameters:**
  - `userPrivateKey`: The user's private key.
  - `litNetwork`: The Lit network key.
- **Returns:** The initialized `LitTester` instance.

##### `initializePKP`
```typescript
async initializePKP(): Promise<void>
```
- Initializes the PKP.
- **Returns:** Nothing.

##### `testLitAction`
```typescript
async testLitAction(params: TestLitActionParams): Promise<any>
```
- Tests a Lit action.
- **Parameters:**
  - `params`: An object containing `litActionCode` and `params`.
- **Returns:** The result of the tested action.

### Enums

#### `FlagForLitTxn`
```typescript
enum FlagForLitTxn {
    SOL,
    CUSTOM,
}
```
- Enum for flags used in Lit transactions.
- **Values:**
  - `SOL`: Indicates a SOL transaction.
  - `CUSTOM`: Indicates a custom token transaction.

### Types

#### `PKP`
```typescript
interface PKP {
    tokenId: string;
    publicKey: string;
    ethAddress: string;
}
```
- Interface for a PKP (Programmable Key Pair).

#### `WK`
```typescript
interface WK {
    pkpAddress: string;
    id: string;
    generatedPublicKey: string;
}
```
- Interface for a Wrapped Key (WK).

#### `AddPermittedActionParams`
```typescript
interface AddPermittedActionParams {
    userPrivateKey: string;
    pkpTokenId: string;
    litActionCode: string;
    pinataAPIKey: string;
}
```
- Interface for parameters used in adding a permitted action.

#### `UploadViaPinataParams`
```typescript
interface UploadViaPinataParams {
    pinataAPIKey: string;
    litActionCode: string;
}
```
- Interface for parameters used in uploading via Pinata.

#### `GetDecipheringDetailsParams`
```typescript
interface GetDecipheringDetailsParams {
    userPrivateKey: string;
    pkp: PKP;
    wk: WK;
}
```
- Interface for parameters used in deciphering details.

#### `CreatePKPWithLitActionParams`
```typescript
interface CreatePKPWithLitActionParams {
    userPrivateKey: string;
    litActionCode: string;
    pinataAPIKey: string;
}
```
- Interface for parameters used in creating a PKP with a Lit action.

#### `ExecuteLitActionParams`
```typescript
interface ExecuteLitActionParams {
    userPrivateKey: string;
    pkpPublicKey: string;
    litActionIpfsCid?: string;
    litActionCode?: string;
    params?: Object;
}
```
- Interface for parameters used in executing a Lit action.

#### `ConditionalSigningOnSolanaParams`
```typescript
interface ConditionalSigningOnSolanaParams {
    userPrivateKey: string;
    litTransaction: any;
    broadcastTransaction: boolean;
    conditionalLogic: string;
    pkp?: PKP;
    wk?: WK;
    params?: Object;
}
```
- Interface for parameters used in conditional signing on Solana.

#### `ExecuteCustomActionOnSolanaParams`
```typescript
interface ExecuteCustomActionOnSolanaParams {
    userPrivateKey: string;
    litActionCode: string;
    pkp?: PKP;
    wk?: WK;
    params?: Object;
}
```
- Interface for parameters used in executing a custom action on Solana.

#### `ExecuteSolanaAgentKitParams`
```typescript
interface ExecuteSolanaAgentKitParams {
    userPrivateKey: string;
    MESSAGE: string;
    RPC_URL: string;
    OPENAI_API_KEY: string;
    pkp?: PKP;
    wk?: WK;
}
```
- Interface for parameters used in executing the Solana Agent Kit.

#### `CreateSerializedLitTxnParams`
```typescript
interface CreateSerializedLitTxnParams {
    toAddress: string;
    amount: number;
    network: Cluster;
    flag: FlagForLitTxn;
    tokenMintAddress?: string;
    wk?: WK;
}
```
- Interface for parameters used in creating a serialized Lit transaction.

#### `SendSolanaWKTxnWithSolParams`
```typescript
interface SendSolanaWKTxnWithSolParams {
    amount: number;
    toAddress: string;
    network: Cluster;
    broadcastTransaction: boolean;
    userPrivateKey: string;
    wk?: WK;
    pkp?: PKP;
}
```
- Interface for parameters used in sending a Solana WK transaction with SOL.

#### `SendSolanaWKTxnWithCustomTokenParams`
```typescript
interface SendSolanaWKTxnWithCustomTokenParams {
    tokenMintAddress: string;
    amount: number;
    toAddress: string;
    network: Cluster;
    broadcastTransaction: boolean;
    userPrivateKey: string;
    wk?: WK;
    pkp?: PKP;
}
```
- Interface for parameters used in sending a Solana WK transaction with a custom token.

#### `TestLitActionParams`
```typescript
interface TestLitActionParams {
    litActionCode: string;
    params: Object;
}
```
- Interface for parameters used in testing a Lit action.


## Examples

### 1) Creating a Key on Solana and Sending Transaction

Using Lit to create a Solana Key and send a Txn with it, an Ethereum private key is used as an auth method for generating signatures with a newly created Solana Key. 

```js
import { LitWrapper } from "lit-wrapper-sdk";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev")

async function generateSolanaWallet() {
    const res = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", res.wkInfo.generatedPublicKey);
}

async function sendSolTxn() {
    const signedTx = await litWrapper.sendSolanaWKTxnWithSol({
        amount: 0.0022 * Math.pow(10, 9),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "mainnet-beta",
        broadcastTransaction: true,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wkResponse: res.wkInfo,
        pkp: res.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}

async function sendBONKTxn() {
    const signedTx = await litWrapper.sendSolanaWKTxnWithCustomToken({
        tokenMintAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK MINT TOKEN
        amount: 4 * Math.pow(10, 5),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "mainnet-beta",
        broadcastTransaction: true,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wkResponse: res.wkInfo,
        pkp: res.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}
```

### 2) Creating Conditional Signing on Solana

Checks against a conditional logic and only creates signatures for a specified transaction when the condition is satisfies

```js
async function createLitActionAndSignSolanaTxn() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response?.wkInfo.generatedPublicKey);

    const conditionLogic = `
    const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
    const resp = await fetch(url).then((response) => response.json());
    const temp = resp.properties.periods[0].temperature;

    console.log(temp);

    // only sign if the temperature is below 60
    if (temp < 60) {
        createSignatureWithAction();
    }`;

    const txn = await litWrapper.createSerializedLitTxn({
        wk: response?.wkInfo,
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        amount: 0.004 * Math.pow(10, 9),
        network: "mainnet-beta",
        flag: FlagForLitTxn.SOL,
    });

    const checkResult = await litWrapper.conditionalSigningOnSolana({
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        litTransaction: txn,
        conditionLogic,
        broadcastTransaction: true,
        wk: response?.wkInfo,
        pkp: response?.pkpInfo,
    });
    console.log(checkResult);
}
```

### 3) Executing Custom AI Powered Lit Actions

```js
async function executeCustomLitAction() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    const litActionCode = `
    const go = async () => {
        try {
            const callAI = await LitActions.runOnce({ 
                waitForResponse: true, name: "Lit Actions Test" },
                async () => {
                    const messages = [
                        { role: "system", content: "You are an AI assistant. Only answer with a single sentence." },
                    ];
                    const response = await fetch(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: \`Bearer \${apiKey}\`,
                        },
                        body: JSON.stringify({ model: "gpt -4o-mini", messages }),
                    });
                    const json = await response.json();
                    console.log(json);
                    return json.choices[0].message;
                });
            console.log(callAI);
            Lit.Actions.setResponse({ response: callAI });
        } catch (error) {
            Lit.Actions.setResponse({ response: error.message });
        }
    }; go();`;

    const result = await litWrapper.executeCustomActionOnSolana({
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        litActionCode,
        pkp: response?.pkpInfo!,
        wk: response?.wkInfo!,
        params: {
            apiKey: process.env.OPEN_AI_API_KEY,
        },
    });
    console.log(result);
}
```


### 4) Creating a key on EVM and Executing a Lit Action

Create a key, Upload Lit Action to IPFS, Permit on IPFS and Execute the action.

```js
import { LitWrapper } from "lit-wrapper-sdk";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev");

async function createKeyAndExecuteAction() {
    const _litActionCode = async () => {
        try {
            const sigShare = await Lit.Actions.ethPersonalSignMessageEcdsa({
                message: dataToSign,
                publicKey: pkpPublicKey,
                sigName,
            });
            Lit.Actions.setResponse({ response: sigShare });
        } catch (error) {
            Lit.Actions.setResponse({ response: error.message });
        }
    };
    const litActionCode = `(${_litActionCode.toString()})();`;

    const { pkp, ipfsCID } = await litWrapper.createPKPWithLitAction(
        process.env.ETHEREUM_PRIVATE_KEY,
        litActionCode,
        process.env.PINATA_API_KEY
    );

    const params = {
        dataToSign: ethers.utils.arrayify(
            ethers.utils.keccak256([1, 2, 3, 4, 5])
        ),
        sigName: "sig1",
    }

    const response = litWrapper.executeLitAction(usePrivateKey, pkp, ipfsCID, params);
    console.log(response)
}
```

### 5) Testing a Lit Action

Instantly create a Lit Action and test its execution over Lit Network.

```js
async function testAction() {
    if (!process.env.ETHEREUM_PRIVATE_KEY) {
        throw new Error("ETHEREUM_PRIVATE_KEY is not set");
    }

    const _litActionCode = async () => {
        try {
            const sigShare = await Lit.Actions.ethPersonalSignMessageEcdsa({
                message: dataToSign,
                publicKey: pkpPublicKey,
                sigName,
            });
            Lit.Actions.setResponse({ response: sigShare });
        } catch (error) {
            Lit.Actions.setResponse({ response: error.message });
        }
    };
    const litActionCode = `(${_litActionCode.toString()})();`;

    const tester = await LitTester.init(
        process.env.ETHEREUM_PRIVATE_KEY,
        "datil-dev"
    );

    const params = [
        {
            dataToSign: ethers.utils.arrayify(
                ethers.utils.keccak256([1, 2, 3, 4, 5])
            ),
            sigName: "sig1",
        }
    ];

    const results = await tester.testLitAction(litActionCode, params[0]);
    console.log("Test Results: ", results);
}
```
