import { LitTester } from "lit-wrapper-sdk";
import * as ethers from "ethers";
import "dotenv/config";

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
actionTester();
