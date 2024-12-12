import { LitTester } from "lit-wrapper-sdk";
import * as ethers from "ethers";
import "dotenv/config";

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

async function test() {
    if (!process.env.ETHEREUM_PRIVATE_KEY) {
        throw new Error("ETHEREUM_PRIVATE_KEY is not set");
    }
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
        {
            dataToSign: ethers.utils.arrayify(
                ethers.utils.keccak256([3, 3, 3, 3, 3])
            ),
            sigName: "sig2",
        },
        {
            dataToSign: ethers.utils.arrayify(
                ethers.utils.keccak256([5, 5, 5, 5, 5])
            ),
            sigName: "sig3",
        }
    ];

    const result1 = await tester.testLitAction(litActionCode, params[0]);
    console.log("test result 1", result1);

    const result2 = await tester.testLitAction(litActionCode, params[1]);
    console.log("test result 2", result2);

    const result3 = await tester.testLitAction(litActionCode, params[2]);
    console.log("test result 3", result3);
}
test();
