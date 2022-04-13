export interface SocialMediaInterface{
    Discord: string,
    Twitter: string,
    Linkedin: string,
    YouTube:string,
    Instagram:string,
    Twitch: string,
    Facebook: string,
    Reddit:string,
    GitHub:string,
    OpenSea:string,
    socialButtonGeneric1: string,
    socialButtonGeneric2: string,
}

export interface AccountDBInterface {
    //this is what is coming OUT of my interface
    wallet_chain_Pkey?: string,
    chainId: string,
    walletAccount: string,
    linkToFinishedAvatar?: string,
    ownerName: string,
    ownerEmail: string,
    ownerDescription: string,
    socialMediaLinks: SocialMediaInterface,
    emailValidationNotification: boolean,
    emailReportNotification: boolean,
}

export interface NFIReceiptInterface {
    wallet_chain_Pkey?: string;
    walletAccount: string;
    chainId: string;
    transactionHash: string;
    receipt: object;
}

export interface AccountPageInterface {
    accountArrDB: string;
    accountArrError: string;
    paramsWallet: string;
    paramsChainId: string | undefined;
    singleAccountDictionaryDB: AccountDBInterface;
    allAccountDictionaryDB: AccountDBInterface[];
    singleNFIReceiptDB: NFIReceiptInterface;
    allNFIReceiptDB: NFIReceiptInterface[];
    accountDBStatus: 'idle' | 'succeeded new entry in DB' | 'failed entry already in DB';
    userSameAccountBool: boolean;
}

export interface ParamsURLInterface {
    chainIdURL: string;
    paramsWalletURL: string;
}



