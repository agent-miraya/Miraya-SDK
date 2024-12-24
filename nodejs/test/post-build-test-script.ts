import { LitWrapper, LitTester } from "../src/index.ts";
import { FlagForLitTxn } from "../dist/types.js";
import * as ethers from "ethers";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev");

const ETHEREUM_PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY as string;

if (!ETHEREUM_PRIVATE_KEY) {
    throw new Error("ETHEREUM_PRIVATE_KEY is required");
}

let dummyResponse = {
    pkpInfo: {
        tokenId:
            "0xe152d8bcd8761f32ef445e611952172f59cd30ae66daa4309446b3528fe054de",
        publicKey:
            "04e16a1e2a7d6c500bd701418910bb178c5f36509c879d58f87cd1e2248957f4e1121a69fb5faed33c842aae3c482fab976e14d8c29d218dd28932327a9f2dbb78",
        ethAddress: "0xE1B12f284654c080145Fed0f991D1C3B8d493A06",
    },
    wkInfo: {
        pkpAddress: "0xE1B12f284654c080145Fed0f991D1C3B8d493A06",
        id: "e8c3b6e4-6afe-46ee-b8e2-1e19b9c2f425",
        generatedPublicKey: "HPLrMfuyaQeZPiwWygnPcCfLtNEgfBJdcUYEWgDwCBhE",
    },
};

async function actionTester() {
    if (!process.env.ETHEREUM_PRIVATE_KEY) {
        throw new Error("ETHEREUM_PRIVATE_KEY is not set");
    }

    const litActionCode = `(async () => {
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
    }) ()`;

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
        },
    ];

    const results = await tester.testLitAction({
        litActionCode,
        params: params[0],
    });
    console.log("Test Results: ", results);
}

async function generateSolanaWallet() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log(
        "Fund this address with bonk and gas sol",
        response?.wkInfo.generatedPublicKey
    );
}

async function sendSolTxn() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response?.wkInfo.generatedPublicKey);

    const signedTx = await litWrapper.sendSolanaWKTxnWithSol({
        amount: 0.004 * Math.pow(10, 9),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "devnet",
        broadcastTransaction: false,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wk: response?.wkInfo,
        pkp: response?.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}

async function sendBONKTxn() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response?.wkInfo.generatedPublicKey);

    const signedTx = await litWrapper.sendSolanaWKTxnWithCustomToken({
        tokenMintAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK MINT TOKEN
        amount: 2 * Math.pow(10, 5),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "mainnet-beta",
        broadcastTransaction: true,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wk: response?.wkInfo,
        pkp: response?.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}

async function generateSolanaWalletAndSendSolTxn() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response?.wkInfo.generatedPublicKey);

    const signedTx = await litWrapper.sendSolanaWKTxnWithSol({
        amount: 0.004 * Math.pow(10, 9),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "mainnet-beta",
        broadcastTransaction: false,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wk: response?.wkInfo,
        pkp: response?.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}

async function getDecipheringDetails() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    const decipheringDetails = await litWrapper.getDecipheringDetails({
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        pkp: response?.pkpInfo!,
        wk: response?.wkInfo!,
    });
    console.log(decipheringDetails);
}

async function createLitActionAndSignSolanaTxn() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response?.wkInfo.generatedPublicKey);

    const conditionalLogic = `
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
        conditionalLogic,
        broadcastTransaction: false,
        wk: response?.wkInfo,
        pkp: response?.pkpInfo,
    });
    console.log(checkResult);
}

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

async function checkAuthMethods() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    const permits = await litWrapper.checkPermits(response?.pkpInfo?.tokenId!);
    console.log(permits);
}

// This will make a Lit Action as an auth method and can be invoked by anyone to create signatures only when conditions are met
async function addLitActionAsAuthMethod() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);

    const litActionCode = `
    const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
    const resp = await fetch(url).then((response) => response.json());
    const temp = resp.properties.periods[0].temperature;

    // only sign if the temperature is below 60
    if (temp < 60) {
        createSignatureWithAction();
    }`;

    const conditionalLogic = await litWrapper.getConditionalLitAction(
        litActionCode
    );

    const permits = await litWrapper.addPermittedAction({
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        pkpTokenId: response?.pkpInfo?.tokenId!,
        litActionCode: conditionalLogic,
        pinataAPIKey: process.env.PINATA_API_KEY!,
    });
    console.log(permits);
}

async function addAuthAddress() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    const authAddressResponse = await litWrapper.addAuthAddress(
        ETHEREUM_PRIVATE_KEY,
        response?.pkpInfo?.tokenId!,
        "0xE1B12f284654c080145Fed0f991D1C3B8d493A06"
    );
    console.log(authAddressResponse);
}

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

async function removePermittedAction() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    await litWrapper.removePermittedAction(
        response?.pkpInfo?.tokenId!,
        "QmQ567ZLdXDWcxXFQ4KaV"
    );
}

async function removeAuthAddress() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    await litWrapper.removeAuthAddress(
        response?.pkpInfo?.tokenId!,
        "0xE1B12f284654c080145Fed0f991D1C3B8d493A06"
    );
}

// actionTester();
// generateSolanaWallet();
// sendSolTxn();
// sendBONKTxn();
// getDecipheringDetails
// generateSolanaWalletAndSendSolTxn();
// createLitActionAndSignSolanaTxn();
// executeCustomLitAction();
// checkAuthMethods()
// addLitActionAsAuthMethod()
// addAuthAddress()
// executeSolanaAgentKit()
// removePermittedAction();
// removeAuthAddress();
