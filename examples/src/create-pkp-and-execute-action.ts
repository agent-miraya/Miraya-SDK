import { LitWrapper } from "lit-wrapper-sdk";
import * as ethers from "ethers";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev");

const ETHEREUM_PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY as string;
const PINATA_API_KEY = process.env.PINATA_API_KEY as string;

if (!ETHEREUM_PRIVATE_KEY) {
    throw new Error("ETHEREUM_PRIVATE_KEY is required");
}

if (!PINATA_API_KEY) {
    throw new Error("PINATA_API_KEY is required");
}

async function createKeyAndExecuteAction() {
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

    const { pkp, ipfsCID } = await litWrapper.createPKPWithLitAction({
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        litActionCode,
        pinataAPIKey: PINATA_API_KEY,
    });

    const resolvedIpfsCID = await ipfsCID;

    const params = {
        dataToSign: ethers.utils.arrayify(
            ethers.utils.keccak256([1, 2, 3, 4, 5])
        ),
        sigName: "sig1",
    };

    const response = await litWrapper.executeLitAction({
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        pkpPublicKey: pkp.publicKey,
        litActionIpfsCid: resolvedIpfsCID,
        params,
    });
    console.log(response);
}

createKeyAndExecuteAction();
