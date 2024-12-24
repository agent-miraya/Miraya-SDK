// src/types.ts
import { Cluster } from "@solana/web3.js";

export interface PKP {
    tokenId: string;
    publicKey: string;
    ethAddress: string;
}

export interface WK {
    pkpAddress: string;
    id: string;
    generatedPublicKey: string;
}

export interface AddPermittedActionParams {
    userPrivateKey: string;
    pkpTokenId: string;
    litActionCode: string;
    pinataAPIKey: string;
}

export interface RemovePermittedActionParams {
    userPrivateKey: string;
    pkpTokenId: string;
    ipfsCID: string;
}

export interface UploadViaPinataParams {
    pinataAPIKey: string;
    litActionCode: string;
}

export interface GetDecipheringDetailsParams {
    userPrivateKey: string;
    pkp: PKP;
    wk: WK;
}

export interface CreatePKPWithLitActionParams {
    userPrivateKey: string;
    litActionCode: string;
    pinataAPIKey: string;
}

export interface ExecuteLitActionParams {
    userPrivateKey: string;
    pkpPublicKey: string;
    litActionIpfsCid?: string;
    litActionCode?: string;
    params?: Object;
}

export interface ConditionalSigningOnSolanaParams {
    userPrivateKey: string;
    litTransaction: any;
    broadcastTransaction: boolean;
    conditionalLogic: string;
    pkp?: PKP;
    wk?: WK;
    params?: Object;
}

export interface ExecuteCustomActionOnSolanaParams {
    userPrivateKey: string;
    litActionCode: string;
    pkp?: PKP;
    wk?: WK;
    params?: Object;
}

export interface ExecuteSolanaAgentKitParams {
    userPrivateKey: string;
    MESSAGE: string;
    RPC_URL: string;
    OPENAI_API_KEY: string;
    pkp?: PKP;
    wk?: WK;
}

export interface CreateSerializedLitTxnParams {
    toAddress: string;
    amount: number;
    network: Cluster;
    flag: FlagForLitTxn;
    tokenMintAddress?: string;
    wk?: WK;
}

export interface SendSolanaWKTxnWithSolParams {
    amount: number;
    toAddress: string;
    network: Cluster;
    broadcastTransaction: boolean;
    userPrivateKey: string;
    wk?: WK;
    pkp?: PKP;
}

export interface SendSolanaWKTxnWithCustomTokenParams {
    tokenMintAddress: string;
    amount: number;
    toAddress: string;
    network: Cluster;
    broadcastTransaction: boolean;
    userPrivateKey: string;
    wk?: WK;
    pkp?: PKP;
}

export interface TestLitActionParams {
    litActionCode: string;
    params: Object;
}

export enum FlagForLitTxn {
    SOL,
    CUSTOM,
}