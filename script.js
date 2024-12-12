import { LitTester } from "./lit.js";
import { litActionCode } from "./litActionCode.js";
import * as ethers from "ethers";

async function test() {
    const tester = await LitTester.init(
        "19a3808c69a5a6434d7c16bf34417efe6a9c02da4b17df741ffbf122d9a57eac",
        "datil-dev"
    );

    const result1 = await tester.testLitAction(litActionCode, {
        dataToSign: ethers.utils.arrayify(
            ethers.utils.keccak256([1, 2, 3, 4, 5])
        ),
        sigName: "sig1",
    });
    console.log("result1", result1);

    const result2 = await tester.testLitAction(litActionCode, {
        dataToSign: ethers.utils.arrayify(
            ethers.utils.keccak256([3, 3, 3, 3, 3])
        ),
        sigName: "sig2",
    });
    console.log("result2", result2);

}

test()
