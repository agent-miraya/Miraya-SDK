import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_ABILITY, LIT_RPC } from "@lit-protocol/constants";
import {
    LitActionResource,
    LitPKPResource,
} from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { EthWalletProvider } from "@lit-protocol/lit-auth-client";
import * as ethers from "ethers";
import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    clusterApiUrl,
} from "@solana/web3.js";
import { api } from "@lit-protocol/wrapped-keys";
const { generatePrivateKey, signTransactionWithEncryptedKey } = api;

class LitWrapper {
    constructor(litNetwork) {
        this.litNetwork = litNetwork;
        this.pkp = null;
    }

    async createPKP(userPrivateKey) {
        try {
            const ethersWallet = new ethers.Wallet(
                userPrivateKey,
                new ethers.providers.JsonRpcProvider(
                    LIT_RPC.CHRONICLE_YELLOWSTONE
                )
            );

            const litContracts = new LitContracts({
                signer: ethersWallet,
                network: this.litNetwork,
                debug: false,
            });
            await litContracts.connect();

            const pkp = (await litContracts.pkpNftContractUtils.write.mint())
                .pkp;
            console.log("PKP: ", pkp);
            this.pkp = pkp;
            return pkp;
        } catch (error) {
            console.error(error);
        }
    }

    async addPermittedAction(
        userPrivateKey,
        pkpTokenId,
        litActionCode,
        pinataAPI
    ) {
        const ipfsCID = await this.uploadViaPinata(pinataAPI, litActionCode);

        const ethersWallet = new ethers.Wallet(
            userPrivateKey,
            new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
        );

        const litContracts = new LitContracts({
            signer: ethersWallet,
            network: this.litNetwork,
            debug: false,
        });
        await litContracts.connect();

        await litContracts.addPermittedAction({
            pkpTokenId: pkpTokenId,
            ipfsId: ipfsCID,
            authMethodScopes: [AuthMethodScope.SignAnything],
        });

        return ipfsCID;
    }

    async uploadViaPinata(pinataAPI, litActionCode) {
        const formData = new FormData();

        const file = new File([litActionCode], "Action.txt", {
            type: "text/plain",
        });
        const pinataMetadata = JSON.stringify({
            name: "EVM-SWAP",
        });
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        });

        formData.append("file", file);
        formData.append("pinataMetadata", pinataMetadata);
        formData.append("pinataOptions", pinataOptions);

        const request = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${pinataAPI}`,
                },
                body: formData,
            }
        );
        const response = await request.json();
        console.log(response);
        return response.IpfsHash;
    }

    async checkPermits(pkpTokenId, litActionCID) {
        console.log("checking perms..");

        const litContracts = new LitContracts({
            network: this.litNetwork,
            debug: false,
        });
        await litContracts.connect();

        let CIDinHex = `0x${Buffer.from(bs58.decode(litActionCID)).toString(
            "hex"
        )}`;
        let permittedActions =
            await litContracts.pkpPermissionsContract.read.getPermittedActions(
                pkpTokenId
            );
        let permittedAuthMethods =
            await litContracts.pkpPermissionsContract.read.getPermittedAuthMethods(
                pkpTokenId
            );
        let permittedAddresses =
            await litContracts.pkpPermissionsContract.read.getPermittedAddresses(
                pkpTokenId
            );

        const results = {
            litAction: {
                cid: litActionCID,
                hex: CIDinHex,
            },
            permissions: {
                actions: permittedActions,
                authMethods: permittedAuthMethods,
                addresses: permittedAddresses,
            },
        };
        console.log(results);
        return results;
    }

    async createPKPWithLitAction(userPrivateKey, litActionCode, pinataAPI) {
        const pkp = this.createPKP(userPrivateKey);
        const ipfsCID = this.addPermittedAction(
            userPrivateKey,
            pkp.tokenId,
            litActionCode,
            pinataAPI
        );
        return { pkp, ipfsCID };
    }

    async executeLitAction(userPrivateKey, pkpPublicKey, litActionCID, params) {
        const litNodeClient = new LitNodeClient({
            litNetwork: this.litNetwork,
            debug: false,
        });
        try {
            await litNodeClient.connect();

            const ethersWallet = new ethers.Wallet(
                userPrivateKey,
                new ethers.providers.JsonRpcProvider(
                    LIT_RPC.CHRONICLE_YELLOWSTONE
                )
            );

            const authMethod = await EthWalletProvider.authenticate({
                signer: ethersWallet,
                litNodeClient,
            });
            const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
                pkpPublicKey: pkpPublicKey,
                chain: "ethereum",
                authMethods: [authMethod],
                resourceAbilityRequests: [
                    {
                        resource: new LitActionResource("*"),
                        ability: LIT_ABILITY.LitActionExecution,
                    },
                    {
                        resource: new LitPKPResource("*"),
                        ability: LIT_ABILITY.PKPSigning,
                    },
                ],
            });

            const result = await litNodeClient.executeJs({
                sessionSigs: pkpSessionSigs,
                ipfsId: litActionCID,
                jsParams: { publicKey: pkpPublicKey, ...params },
            });

            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            litNodeClient?.disconnect();
        }
    }

    async createSolanaWK(userPrivateKey) {
        const litNodeClient = new LitNodeClient({
            litNetwork: this.litNetwork,
            debug: false,
        });
        try {
            await this.createPKP(userPrivateKey);
            
            const ethersWallet = new ethers.Wallet(
                userPrivateKey,
                new ethers.providers.JsonRpcProvider(
                    LIT_RPC.CHRONICLE_YELLOWSTONE
                )
            );
            const authMethod = await EthWalletProvider.authenticate({
                signer: ethersWallet,
                litNodeClient,
            });
            
            await litNodeClient.connect();

            const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
                pkpPublicKey: this.pkp.publicKey,
                chain: "ethereum",
                authMethods: [authMethod],
                resourceAbilityRequests: [
                    {
                        resource: new LitActionResource("*"),
                        ability: LIT_ABILITY.LitActionExecution,
                    },
                    {
                        resource: new LitPKPResource("*"),
                        ability: LIT_ABILITY.PKPSigning,
                    },
                ],
                expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
            });

            const wrappedKeyInfo = await generatePrivateKey({
                pkpSessionSigs,
                network: "solana",
                memo: "This is a test memo",
                litNodeClient,
            });

            console.log("WK: ", wrappedKeyInfo)
            return wrappedKeyInfo;
        } catch (error) {
            console.error;
        } finally {
            litNodeClient?.disconnect();
        }
    }

    async sendSolanaWKTxn(wkResponse, userPrivateKey, broadcastTransaction, pkp) {
        this.pkp = pkp
        const litNodeClient = new LitNodeClient({
            litNetwork: this.litNetwork,
            debug: false,
        });
        try {
            const generatedSolanaPublicKey = new PublicKey(
                wkResponse.generatedPublicKey
            );

            const solanaTransaction = new Transaction();
            solanaTransaction.add(
                SystemProgram.transfer({
                    fromPubkey: generatedSolanaPublicKey,
                    toPubkey: generatedSolanaPublicKey,
                    lamports: LAMPORTS_PER_SOL / 100, // Transfer 0.01 SOL
                })
            );
            solanaTransaction.feePayer = generatedSolanaPublicKey;

            const solanaConnection = new Connection(
                clusterApiUrl("devnet"),
                "confirmed"
            );
            const { blockhash } = await solanaConnection.getLatestBlockhash();
            solanaTransaction.recentBlockhash = blockhash;

            const serializedTransaction = solanaTransaction
                .serialize({
                    requireAllSignatures: false, // should be false as we're not signing the message
                    verifySignatures: false, // should be false as we're not signing the message
                })
                .toString("base64");

            const litTransaction = {
                serializedTransaction,
                chain: "devnet",
            };

            await litNodeClient.connect();
            const ethersWallet = new ethers.Wallet(
                userPrivateKey,
                new ethers.providers.JsonRpcProvider(
                    LIT_RPC.CHRONICLE_YELLOWSTONE
                )
            );
            const authMethod = await EthWalletProvider.authenticate({
                signer: ethersWallet,
                litNodeClient,
            });

            const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
                pkpPublicKey: this.pkp.publicKey,
                chain: "ethereum",
                authMethods: [authMethod],
                resourceAbilityRequests: [
                    {
                        resource: new LitActionResource("*"),
                        ability: LIT_ABILITY.LitActionExecution,
                    },
                    {
                        resource: new LitPKPResource("*"),
                        ability: LIT_ABILITY.PKPSigning,
                    },
                ],
                expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
            });

            const signedTransaction = await signTransactionWithEncryptedKey({
                pkpSessionSigs,
                network: "solana",
                id: wkResponse.id,
                unsignedTransaction: litTransaction,
                broadcast: broadcastTransaction,
                litNodeClient,
            });
            return signedTransaction;
        } catch (error) {
            console.error(error);
        } finally {
            litNodeClient?.disconnect();
        }
    }
}

class LitTester {
    constructor(userPrivateKey, litNetwork) {
        this.litNetwork = litNetwork;
        this.userPrivateKey = userPrivateKey;
        this.pkp = null;
        this.initialized = false;
    }

    static async init(userPrivateKey, litNetwork) {
        const instance = new LitTester(userPrivateKey, litNetwork);
        await instance.initializePKP();
        return instance;
    }

    async initializePKP() {
        if (this.initialized) return;
        
        try {
            const ethersWallet = new ethers.Wallet(
                this.userPrivateKey,
                new ethers.providers.JsonRpcProvider(
                    LIT_RPC.CHRONICLE_YELLOWSTONE
                )
            );

            const litContracts = new LitContracts({
                signer: ethersWallet,
                network: this.litNetwork,
                debug: false,
            });
            await litContracts.connect();

            const pkp = (await litContracts.pkpNftContractUtils.write.mint())
                .pkp;
            this.pkp = pkp;
            console.log("PKP: ", this.pkp)
            this.initialized = true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async testLitAction(litActionCode, params) {
        const litNodeClient = new LitNodeClient({
            litNetwork: this.litNetwork,
            debug: false,
        });
        try {
            await litNodeClient.connect();

            const ethersWallet = new ethers.Wallet(
                this.userPrivateKey,
                new ethers.providers.JsonRpcProvider(
                    LIT_RPC.CHRONICLE_YELLOWSTONE
                )
            );

            const authMethod = await EthWalletProvider.authenticate({
                signer: ethersWallet,
                litNodeClient,
            });

            const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
                pkpPublicKey: this.pkp.publicKey,
                chain: "ethereum",
                authMethods: [authMethod],
                resourceAbilityRequests: [
                    {
                        resource: new LitActionResource("*"),
                        ability: LIT_ABILITY.LitActionExecution,
                    },
                    {
                        resource: new LitPKPResource("*"),
                        ability: LIT_ABILITY.PKPSigning,
                    },
                ],
            });

            const result = await litNodeClient.executeJs({
                sessionSigs: pkpSessionSigs,
                code: litActionCode,
                jsParams: { pkpPublicKey: this.pkp.publicKey, ...params },
            });
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            litNodeClient?.disconnect();
        }
    }
}

export { LitWrapper, LitTester };