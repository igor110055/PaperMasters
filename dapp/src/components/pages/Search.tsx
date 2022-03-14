import * as React from 'react';
import {useState, useEffect, useCallback, useMemo, MouseEventHandler, ChangeEventHandler} from "react";
import Web3 from "web3";
import type {FC} from 'react';
import {
    Box,
    Flex,
    MenuButton,
    Input,
    Button,
    HStack,
    InputGroup,
    InputRightAddon,
    Text,
    FormControl
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import DataTable, {ExpanderComponentProps, TableColumn} from 'react-data-table-component';
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import Sidebar from "../Sidebar";
import {Link as ReachLink} from "react-router-dom";
import {MdManageAccounts} from "react-icons/md";
import {HiOutlineDocumentReport} from "react-icons/hi";
import {MdOutlineLibraryAddCheck} from "react-icons/md";
import {SiSololearn} from "react-icons/si";
import IdentityEntryModal from "../../utils/IdentityEntryModal";
import {getReceiptDBCurrentUser} from "../../features/AccountSlice";
import {
    getAllReceiptFromDBAction,
    getAllWalletFromDBAction,
    putWalletInDBStatus
} from "../../features/RequestWalletSlice";
import AvatarNFI from "../AvatarNFI";


interface DataRow {
    name: string;
    walletAccount: string;
    validations: number;
    originDate: string;
    profession: string;
    reported: number;
};

interface interfaceFilterComponent{
    filterText: string,
    onClick: MouseEventHandler<HTMLButtonElement>,
    onFilter: ChangeEventHandler<HTMLInputElement>,
    text: string,
    placeHolder: string,
    idType: string,
    activateButton: boolean,
}

const FilterComponent: FC<interfaceFilterComponent> = ( { filterText, onClick, onFilter, text , placeHolder, idType, activateButton}) => (

    <Box>
        <HStack>
            <InputGroup>
            <Input focusBorderColor='pmpurple.8' color={'pmpurple.13'} border={'1px solid'} borderColor={'pmpurple.3'} id={idType} type="text" placeholder={placeHolder} aria-label="Search Input" value={filterText} onChange={onFilter} />
                <InputRightAddon
                    p='0' borderColor={"pmpurple.4"} bg={'pmpurple.2'}
                    children={<Button bg={'pmpurple.5'} color={"pmpurple.13"} disabled={activateButton} onClick={onClick} >{text}</Button>} />
            </InputGroup>
        </HStack>
    </Box>
)

// data provides access to your row data

const ExpandedComponent: FC<ExpanderComponentProps<DataRow>> = ({ data }) => {
    console.log(data)
    // @ts-ignore
    const identityStruct: any[] = data['identityStruct'] as any[]
    if(identityStruct.length === 0){
        return (null);
    }
        return(

    <AvatarNFI
        accountNumber={identityStruct[0]}
        name={identityStruct[1].split("|||")[0]}
        nameColor={identityStruct[1].split("|||")[1]}
        email={identityStruct[2].split("|||")[0]}
        emailColor={identityStruct[2].split("|||")[1]}
        profession={identityStruct[3].split("|||")[0]}
        professionColor={identityStruct[3].split("|||")[1]}
        organization={identityStruct[4].split("|||")[0]}
        organizationColor={identityStruct[4].split("|||")[1]}
        slogan={identityStruct[5].split("|||")[0]}
        sloganColor={identityStruct[5].split("|||")[1]}
        website={identityStruct[6].split("|||")[0]}
        websiteColor={identityStruct[6].split("|||")[1]}
        uniqueYou={identityStruct[7].split("|||")[0]}
        uniqueYouColor={identityStruct[7].split("|||")[1]}
        avatarBG={identityStruct[8]}
        originDate={parseInt(identityStruct[9])}
    />
        )

};

export const Search: FC=()=> {
    const requesterConnectedUserAccountsArr = useAppSelector((state) => state.register.accounts);
    const addressHasIdentityBool = useAppSelector((state) => state.minted.addressHasIdentity);
    const tokenIDToIdentity = useAppSelector((state) => state.minted.tokenIDtoIdentityStruct);
    const getAllWalletFromDB = useAppSelector((state) => state.register.getAllWalletFromDB);
    const getOneWalletFromDB = useAppSelector((state) => state.register.getOneWalletFromDB);
    const getAllReceiptFromDB = useAppSelector((state) => state.register.getAllReceiptFromDB);
    const getOneReceiptFromDB = useAppSelector((state) => state.register.getOneReceiptFromDB);

    const [filterText, setFilterText] = useState<string>('');
    const [searchWalletAccount, setWalletAccount] = useState<string>('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState<boolean>(false);
    const [isIdentityModalOpen, setIdentityModalOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();


    console.log('this is the getallwalletfromdb', getAllWalletFromDB);
    console.log('this is the getAllReceiptFromDB', getAllReceiptFromDB)

    // useEffect( getSpecificWallet=()=> {
    //     //walletString = getAllWalletFromDB[0];
    //     getAllWalletFromDB.walletAccount = useParams;
    // }[]);


    //console.log('this is the getallwalletfromdb name:' getAllWalletFromDB.name)

    useEffect(() => {
        dispatch(getAllWalletFromDBAction());
        dispatch(getAllReceiptFromDBAction());
    }, []);

    const rowsTable = useMemo(() => {
        const receiptDictionary: any = {};
        console.log('get all receipts from db', getAllReceiptFromDB)
        getAllReceiptFromDB.map((el) => {
            receiptDictionary[el.walletAccount] = el;
        })
        console.log('this is the receiptDictionary:', receiptDictionary);
        const datarow: DataRow[] = [];
        getAllWalletFromDB.map((element) => {
            let name = "";
            let profession = "";
            let originDateFormatted:string = "";
            let identityStruct:any[] = [];
            if (receiptDictionary.hasOwnProperty(element.walletAccount)) {
                console.log('this is the receiptdictionary walletaccount', receiptDictionary[element.walletAccount])
                if (receiptDictionary[element.walletAccount].hasOwnProperty('identityStruct')) {
                    if (receiptDictionary[element.walletAccount]['identityStruct'].length >= 10) {
                        identityStruct = receiptDictionary[element.walletAccount]['identityStruct']
                        name = receiptDictionary[element.walletAccount]['identityStruct'][1].split('|||')[0]
                        profession = receiptDictionary[element.walletAccount]['identityStruct'][3].split('|||')[0]
                        const originDate = receiptDictionary[element.walletAccount]['identityStruct'][9]
                        const originDateObject = new Date(originDate);
                        originDateFormatted = `${originDateObject.toLocaleString('en-us', {month: 'long'})} ${originDateObject.getDate()}, ${originDateObject.getFullYear()}`
                        console.log("this is the origin date from Search", originDate)
                    }
                }
            }

            const singleWalletDictionary = {
                identityStruct: identityStruct,
                walletAccount: element.walletAccount,
                name: (name ? name : "non-registered"),
                profession: profession,
                validations: 1,
                originDate: originDateFormatted,
                reported: 0,
            }
            datarow.push(singleWalletDictionary);
        })
        return datarow;
    }, [getAllWalletFromDB, getAllReceiptFromDB]);
    console.log("this is my rowstable", rowsTable);

    const columns: TableColumn<DataRow>[] = [
        {
            //allowRowEvents: true,
            name: 'Wallet Account',
            //cell: (row, index, column, id)=>{ <button onClick={handleButtonClick}>Action</button>},
            selector: row => row.walletAccount,
            cell: (row, index, column, id) => <Button as={ReachLink} to={`/identity/${row.walletAccount}`}
                                                      bg={'#f2eef2'} color={'pmpurple.13'} fontSize={'12px'}>
                <Text ml={'6px'}> {row.walletAccount} </Text>
            </Button>,
            sortable: true,
            reorder: true,
            center: true,
            //sortable: true,
            grow: 3.2,
            style: {
                backgroundColor: '#f2eef2',
                fontWeight: 'bold'
            },
        },
        {
            name: 'Name',
            selector: row => row.name,
            cell: (row, index, column, id) => <Button as={ReachLink} to={`/identity/${row.walletAccount}`}
                                                      color={'pmpurple.13'} fontSize={'12px'}>
                <Text ml={'6px'}> {row.name} </Text>
            </Button>,
            sortable: true,
            reorder: true,
            center: true,
        },
        {
            name: 'Origin Date',
            selector: row => row.originDate,
            sortable: true,
            reorder: true,
            center: true,
        },
        {
            name: 'Profession',
            selector: row => row.profession,
            sortable: true,
            reorder: true,
            center: true,
        },
        {
            name: 'Validations',
            selector: row => row.validations,
            sortable: true,
            reorder: true,
            center: true,
        },
        {
            name: 'Validate',
            sortable: true,
            reorder: true,
            button: true,
            center: true,
            cell: () => <Button as={ReachLink} to={'/validate'} color={'pmpurple.13'} bg={'#f2eef2'} fontSize={'12px'}>
                <MdOutlineLibraryAddCheck fontSize={'16px'}/>
                <Text ml={'6px'}> Validate </Text>
            </Button>,
        },
        {
            name: 'Reported',
            selector: row => row.reported,
            sortable: true,
            reorder: true,
            center: true,
        },
        {
            name: 'Report',
            sortable: true,
            reorder: true,
            button: true,
            center: true,
            cell: () => <Button as={ReachLink} to={'/report'} color={'pmpurple.13'} bg={'#f2eef2'} fontSize={'12px'}>
                <HiOutlineDocumentReport
                    fontSize={'16px'}/>
                <Text ml={'6px'}> Report </Text>
            </Button>,
        },

    ];


    const filteredItems = rowsTable.filter(item => {
            if (filterText.length === 0 && searchWalletAccount.length === 0) {
                return item;
            }
            if (filterText.length !== 0) {
                if (item.name && item.name.toLowerCase().includes(filterText.toLowerCase())) {
                    return item;
                }
                if (item.profession && item.profession.toLowerCase().includes(filterText.toLowerCase())) {
                    return item;
                }
                if (item.originDate && item.originDate.toLowerCase().includes(filterText.toLowerCase())) {
                    return item;
                }
                if (item.walletAccount && item.walletAccount.toLowerCase().includes(filterText.toLowerCase())) {
                    return item;
                }
            }
            if (searchWalletAccount.length !== 0) {
                if (item.walletAccount && item.walletAccount.toLowerCase().includes(searchWalletAccount.toLowerCase()) && item.name && item.name.toLowerCase().includes(filterText.toLowerCase())) {
                    return item;
                }
            }
        }
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
        const addWalletAccountHandler = () => {
            setIdentityModalOpen(true)
        };

        return (
            <Box>
                <HStack>

                    <FilterComponent onFilter={(e: any) => setFilterText(e.target.value)} onClick={handleClear}
                                     activateButton={false}
                                     filterText={filterText} text={"reset"} placeHolder={"Search NFI"}
                                     idType={"Search"}/>

                    <FilterComponent onFilter={(e: any) => setWalletAccount(e.target.value)}
                                     onClick={addWalletAccountHandler} activateButton={(filteredItems.length !== 0)}
                                     filterText={searchWalletAccount} text={"Add Wallet Account"}
                                     placeHolder={"Search Wallet Account"} idType={"WalletAccount"}/>

                    <IdentityEntryModal title={'Create a profile for a Non-Registered'} text={'Enter Wallet Account'}
                                        placeHolder={'wallet account'}
                                        buttonText={'Create'} isOpen={isIdentityModalOpen} onClose={() => {
                        setIdentityModalOpen(false)
                    }}/>
                </HStack>
            </Box>
        );
    }, [filterText, searchWalletAccount, resetPaginationToggle, filteredItems]);


    return (

        <Flex
            justifyContent="center"
            flex='auto'
            w={'100%'}
            p={'16px'}

        >
            <Box
                border={'1px'}
                borderStyle={"solid"}
                borderColor={'pmpurple.13'}
            >
                <DataTable
                    title="Non-Fungible-Identities"
                    columns={columns}
                    data={filteredItems}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    defaultSortFieldId={5}
                    fixedHeader={true}
                    fixedHeaderScrollHeight={'60vh'}
                    pagination={true}
                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                    subHeader={true}
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                    paginationPerPage={20}
                    striped={true}
                    //selectableRows
                />
            </Box>
        </Flex>
    )
};

export default Search;