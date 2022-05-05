import { createApi, fetchBaseQuery,   buildCreateApi, BaseQueryFn, fakeBaseQuery,
    coreModule,
    reactHooksModule } from '@reduxjs/toolkit/query/react'
import {AccountDBInterface, AccountPageInterface, ParamsURLInterface} from '../accountDB/AccountDBSlice.types'
import MintABI from "../../abiFiles/PaperMastersNFI.json";
import chainIdNetworks from "../JSON/chainId.networks.json";
import Web3 from "web3";
import chainIdJSON from "../JSON/chainId.json";
import {BigNumber, ethers} from "ethers";

export interface accountsApiInterface{
    Count: number,
    Items:AccountDBInterface[]
}

export interface postMentionInterface {
    chainId: string,
    walletAccount: string;
    fromChainId: string;
    fromWallet: string;
    replyToMentionId: string;
    fakeDelete: boolean;
    messageBody: string;
    radioType: -1 | 1 | 0;
}

export interface getMentionInterface {
    mentionId: string,
    chainId_walletAccount_Pkey: string,
    chainId: string,
    walletAccount: string;
    fromChainId: string;
    fromWallet: string;
    replyToMentionId: string;
    fakeDelete: boolean;
    messageBody: string;
    radioType: -1 | 1 | 0;
    timeStamp: number;
}

export interface getMentionsApiInterface{
    Count: number,
    Items:getMentionInterface[]
}
export const accountDBApi= createApi({
    reducerPath: 'accountDBApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://ociuozqx85.execute-api.us-east-1.amazonaws.com' }),
    tagTypes: ['singleAccountApi', 'allAccountApi', 'getMentionApi'],
    endpoints: (builder) => ({
        getSingleAccount: builder.query<AccountDBInterface, ParamsURLInterface>({
            query: ({chainIdURL, paramsWalletURL}:ParamsURLInterface) => `account/${chainIdURL}/${paramsWalletURL}`,
            providesTags: ['singleAccountApi'],
        }),
        getAllAccount: builder.query<accountsApiInterface, void>({
            query: () => `account`,
            providesTags: ['allAccountApi']
        }),
        getMention: builder.query<getMentionsApiInterface, ParamsURLInterface>({
            query: ({chainIdURL, paramsWalletURL}:ParamsURLInterface) => `mentions/${chainIdURL}/${paramsWalletURL}`,
            providesTags: ['getMentionApi'],
            transformResponse: (response:getMentionsApiInterface, meta, arg) => {
                response.Items.sort((a,b)=>{
                    return b.timeStamp - a.timeStamp
                })
                return response
            }
        }),
        postMention: builder.mutation<string, postMentionInterface>({
            query: (mentionBody:postMentionInterface) => ({
                url: 'mentions',
                method: 'POST',
                body: mentionBody
            }),
            invalidatesTags: ['getMentionApi'],
        }),
    }),
})

export interface fetchAddressToTokenInterface{
    tokenId: number,
    nfiIdentity: BCStruct | null
}

export interface BCStruct{
    chainId: BigNumber;
    walletAccount: string;
    name: string;
    email: string;
    profession: string;
    organization: string;
    slogan: string;
    website: string;
    uniqueYou: string;
    bgRGB: string;
    originDate: BigNumber;
}

export const nfiBCApi = createApi({
    reducerPath: 'nfiBCApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['allNFIApi', 'singleNFIApi'],
        endpoints: (builder) => ({
        getIdentityBC: builder.query<BCStruct[], void>({
            queryFn: fetchIdentities,
            providesTags: ['allNFIApi']
        }),
        getSingleIdentityBC: builder.query<fetchAddressToTokenInterface, ParamsURLInterface>({
            queryFn: fetchAddressToToken,
            providesTags: ['singleNFIApi'],
            // transformResponse: (response:fetchAddressToTokenInterface) => {
            //     return response as fetchAddressToTokenInterface
            // }
        }),
    }),
})

export async function fetchIdentities() {
    const results = await Promise.all(Object.keys(MintABI.networks).map(async (chainId): Promise<BCStruct[]> => {
            const chainIdSupportedArr = chainIdNetworks.filter((el) => {
                return el.chainId === parseInt(chainId)
            });
            console.log("chainIdSupportedArr", chainIdSupportedArr)
            const rpcSupported = chainIdSupportedArr[0].rpc[0];
            console.log("rpcsupported", rpcSupported)
        const network = chainIdSupportedArr[0].name.toLowerCase();
        const provider = ethers.getDefaultProvider(network, {
            etherscan: 'RYVBB5ZI138MHIX2JJVWBT6MVTGXJT133Q',
            infura: 'c97ad56e08674161a95ba16c6f855b6a',
            alchemy: 'mEUzvPVY6xECwMieu01t9D3fuYyOYGCl',
            pocket: '329ee9f55d37f7ef7a54f84a4df341d096004450263af1d40cc4650e47e26609'
        });
        console.log('provider TESTfetchIdentities:', provider);
        const NFIContract = new ethers.Contract(MintABI.networks[chainId].address, MintABI.abi as any, provider);
        console.log('NFIContract:', NFIContract);
            const identStructBC = await NFIContract.allIdentityStructs();
            console.log("identStructBC:",identStructBC)
            return (identStructBC);
        }
    ))
    console.log('results', results)
    return {data:results.flat()};
}

export async function WEB3fetchIdentities() {
    const results = await Promise.all(Object.keys(MintABI.networks).map(async (chainId): Promise<BCStruct[]> => {
            const chainIdSupportedArr = chainIdNetworks.filter((el) => {
                return el.chainId === parseInt(chainId)
            });
            console.log("chainIdSupportedArr", chainIdSupportedArr)
            const rpcSupported = chainIdSupportedArr[0].rpc[0];
            console.log("rpcsupported", rpcSupported)
            const web3 = new Web3(rpcSupported);
            const NFIContract = new web3.eth.Contract(MintABI.abi as any, MintABI.networks[chainId].address);
            const identStructBC = await NFIContract.methods.allIdentityStructs().call();
            return (identStructBC);
        }
    ))
    console.log('results', results)
    return {data:results.flat()};
}

export async function fetchAddressToToken({chainIdURL, paramsWalletURL}: ParamsURLInterface){
    const fetchDictionaryReturn:fetchAddressToTokenInterface = {
        tokenId: 0,
        nfiIdentity: null
    }
    console.log('fetchAddressToToken:', fetchAddressToToken)
        if(paramsWalletURL.length > 0)
    {
        if (Object.prototype.hasOwnProperty.call(MintABI.networks, `${chainIdURL}`)) {
            const chainIdSupportedArr = chainIdNetworks.filter((el) => {
                return el.chainId === parseInt(chainIdURL)
            });
            const provider = ethers.getDefaultProvider(chainIdSupportedArr[0].name.toLowerCase(), {
                etherscan: 'RYVBB5ZI138MHIX2JJVWBT6MVTGXJT133Q',
                infura: 'c97ad56e08674161a95ba16c6f855b6a',
                alchemy: 'mEUzvPVY6xECwMieu01t9D3fuYyOYGCl',
                pocket: '329ee9f55d37f7ef7a54f84a4df341d096004450263af1d40cc4650e47e26609'
            });
            const NFIContract = new ethers.Contract(MintABI.networks[chainIdURL].address, MintABI.abi as any, provider);
            console.log('NFIContract:', NFIContract);
            const addressToTokenIDID = await NFIContract.addressToTokenID(paramsWalletURL);
            console.log("addresstotokenId:", addressToTokenIDID)
            const addressToTokenIDIDNUMBER = parseInt(addressToTokenIDID)
            if (addressToTokenIDIDNUMBER >= 1) {
               fetchDictionaryReturn.tokenId = addressToTokenIDIDNUMBER;
                fetchDictionaryReturn.nfiIdentity = await NFIContract.addressToIdentityStruct(paramsWalletURL);
                return {data: fetchDictionaryReturn};
            }
        }
    }
    //return {data: fetchDictionaryReturn};
    return { error: { status: 404, data: " NfI does not exist" } }
}

export const { useGetSingleAccountQuery, useGetAllAccountQuery, useGetMentionQuery, usePostMentionMutation} = accountDBApi
export const { useGetIdentityBCQuery, useGetSingleIdentityBCQuery } = nfiBCApi
