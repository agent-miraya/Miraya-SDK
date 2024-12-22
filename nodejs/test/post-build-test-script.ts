import { LitWrapper, LitTester } from "../dist/index.js";
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

    const litActionCode =
    `(async () => {
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

    const results = await tester.testLitAction({litActionCode, params: params[0]});
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

// actionTester();
// generateSolanaWallet();
// sendSolTxn();
// sendBONKTxn();
// generateSolanaWalletAndSendSolTxn();
createLitActionAndSignSolanaTxn();
