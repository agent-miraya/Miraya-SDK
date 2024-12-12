import { LitWrapper } from "../lit.js";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev");

const _litActionCode = async () => {
    try {
        const sigShare = await LitActions.ethPersonalSignMessageEcdsa({
            message: dataToSign,
            publicKey: pkpPublicKey,
            sigName,
        });
        LitActions.setResponse({ response: sigShare });
    } catch (error) {
        LitActions.setResponse({ response: error.message });
    }
};

const litActionCode = `(${_litActionCode.toString()})();`;

async function createKeyAndExecuteAction() {
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

createKeyAndExecuteAction()