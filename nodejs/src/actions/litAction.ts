export const litAction = (conditionalLogic: any) => {
    return `
        const createSignatureWithAction = async () => {
            const response = await Lit.Actions.call({
                ipfsId: "QmR1nPG2tnmC72zuCEMZUZrrMEkbDiMPNHW45Dsm2n7xnk", // Lit Action for signing on Solana
                params: {
                    accessControlConditions,
                    ciphertext,
                    dataToEncryptHash,
                    unsignedTransaction,
                    broadcast,
                },
            });
            console.log(response);
            return response;
        };

        const run = async () => {
            try {
                let response;
                ${conditionalLogic.replace(
                    "createSignatureWithAction();",
                    "response = await createSignatureWithAction();"
                )};
                Lit.Actions.setResponse({ response: response });
            } catch (error) {
                Lit.Actions.setResponse({ response: error.message });
            }
        };
        run();
    `;
};
