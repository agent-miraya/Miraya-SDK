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
  
  export const litActionCode = `(${_litActionCode.toString()})();`;