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

createKeyAndExecuteAction()