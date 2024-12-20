import { LitWrapper } from "lit-wrapper-sdk";
import { FlagForLitTxn } from "lit-wrapper-sdk/types";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev");

const ETHEREUM_PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY as string;

if (!ETHEREUM_PRIVATE_KEY) {
    throw new Error("ETHEREUM_PRIVATE_KEY is required");
}

async function createLitActionAndSignSolanaTxn() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response);

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
        broadcastTransaction: false,
        wk: response?.wkInfo,
        pkp: response?.pkpInfo,
    });
    console.log(checkResult);
}
createLitActionAndSignSolanaTxn();
