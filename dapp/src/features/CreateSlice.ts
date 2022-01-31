import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import Web3 from "web3";


interface PMIState {
    accounts: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PMIState = {
    accounts: [],
    status: 'idle',

};
const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");


// First, create the thunk
export const requestMetaMaskAccount = createAsyncThunk('PMI/request', async (_) => {
    console.log("TRY");
        try {
            console.log("WEb3 Get Accounts");
            const accounts = await web3.eth.requestAccounts();
            console.log(accounts);
            return accounts;
        } catch {
            console.log("ERROR STATE!")
            return []
        }

    }
)

const CreateSlice = createSlice ({
    name: 'PMI',
    initialState,
    reducers: {
        accountsArr(state, action){
            //it's okay to do this because immer makes it immutable under the hood
            state.accounts = action.payload;
        },
        statusOfArr(state, action){
            state.status = action.payload;
        },

        //update state of accounts/wallet to include/showing PMI token after created action fires
        //update state of accounts page to include new PMI token added
        //update state of accounts page to make TRANSFER, mint new NFT, and add a personal description to the page after PMI token after created action fires
    },
    extraReducers: (builder) =>  {
        builder.addCase(requestMetaMaskAccount.pending, (state: PMIState) => {
            state.status = "loading"
        });
        builder.addCase(requestMetaMaskAccount.fulfilled, (state: PMIState, {payload}: any) => {
            state.status = "idle"
            state.accounts = payload as string[]
        });
        builder.addCase(requestMetaMaskAccount.rejected, (state: any) => {
            state.status = "idle"
            state.accounts = []
        });
    }
});
console.log(CreateSlice);
export const { accountsArr, statusOfArr } = CreateSlice.actions;
export default CreateSlice.reducer;


