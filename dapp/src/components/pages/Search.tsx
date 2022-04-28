import * as React from 'react';
import {useState, useEffect, useCallback, useMemo, MouseEventHandler, ChangeEventHandler} from "react";
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
    FormControl, Tooltip, UnorderedList, ListItem, Heading,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    chakra,
    Link,
} from '@chakra-ui/react';
import {Link as ReachLink, To} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import DataTable, {ExpanderComponentProps, TableColumn} from 'react-data-table-component';
import IdentityEntryModal from "../../utils/IdentityEntryModal";
import AvatarNFI from "../AvatarNFI";
import {allAccountDictionaryDBAction, allNFIReceiptDBAction} from "../../features/accountDB/AccountDBSlice";
import {BCStruct} from "../../features/accountBC/AccountBCSlice.types";
import {accountBCselectors, allStructBCAction, getAllStructBC} from "../../features/accountBC/AccountBCSlice";
import {useQuery} from "react-query";
import {useTable, Column, TableOptions, useSortBy} from "react-table";
import {useGetAllAccountQuery, useGetIdentityBCQuery} from "../../features/reactQuery/RTKQuery";
import {AccountDBInterface} from "../../features/accountDB/AccountDBSlice.types";
import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {HiOutlineDocumentReport} from "react-icons/hi";
import {MdOutlineLibraryAddCheck} from "react-icons/md";


interface interfaceFilterComponent{
    filterText: string,
    onClick: MouseEventHandler<HTMLButtonElement>,
    onFilter: ChangeEventHandler<HTMLInputElement>,
    text: string,
    placeHolder: string,
    idType: string,
    activateButton: boolean,
}

const FilterComponent: FC<interfaceFilterComponent> = ( { filterText, onClick, onFilter, text ,
                                                        placeHolder, idType, activateButton}) => (
    <Box>
        <HStack>
            <InputGroup>
            <Input focusBorderColor='pmpurple.8' color={'pmpurple.13'} border={'1px solid'} borderColor={'pmpurple.3'}
                   id={idType} type="text" placeholder={placeHolder} aria-label="Search Input" value={filterText}
                   onChange={onFilter} />
                <Tooltip hasArrow label='Please type at minimum 32 characters to add a wallet account'
                         placement={'bottom-end'} border={'1px solid #694b69'}
                         borderRadius={'3px'} bg='pmpurple.5' color='pmpurple.13' m={'-6px'}>
                <InputRightAddon
                    p='0' borderColor={"pmpurple.4"} bg={'pmpurple.2'}
                    children={<Button bg={'pmpurple.5'} color={"pmpurple.13"} disabled={activateButton}
                                      onClick={onClick} >{text}</Button>} />
                </Tooltip>
                </InputGroup>
        </HStack>
    </Box>
)

// data provides access to your row data
// interface DataRow {
//     //TODO: chainId should display the actual blockchain name and not just the number
//     chainId: string;
//     walletAccount?: string;
//     name?: string;
//     validations: number;
//     originDate: string;
//     profession?: string;
//     reported: number;
//     identityStruct<BCStruct>;
// }

const ExpandedComponent: FC<ExpanderComponentProps<BCStruct[]>> = ({ data }) => {
    console.log("this is Search - Data", data)
    const addressHasIdentityBoolBool = useAppSelector((state) => state.accountBC.addressHasIdentityBool);
    if (!addressHasIdentityBoolBool) {
        return null;
    }
    const getAllStructBCBC = useAppSelector((state) => state.accountBC.getAllStructBC);
    const dispatch = useAppDispatch();
    dispatch(allStructBCAction);
    const identityStruct = data['getAllStructBCBC']
    if (getAllStructBCBC[0].length === 0) {
        return null;
    }
    return (
        identityStruct.map(
            <AvatarNFI
                walletAccount={identityStruct[0]}
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
    )
};

export const Search:FC =()=> {

    const accountArrArr = useAppSelector((state) => state.accountBC.accountArr);
    const addressHasIdentityBoolBool = useAppSelector((state) => state.accountBC.addressHasIdentityBool);
    const getAllStructBCBC = useAppSelector((state) => state.accountBC.getAllStructBC);
    const paramsWalletWallet = useAppSelector((state) => state.accountDB.paramsWallet);
    const allAccountDictionaryDBDB = useAppSelector((state) => state.accountDB.allAccountDictionaryDB);

    const [filterText, setFilterText] = useState<string>('');
    const [searchWalletAccount, setWalletAccount] = useState<string>('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState<boolean>(false);
    const [isIdentityModalOpen, setIdentityModalOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(allAccountDictionaryDBAction());
        dispatch(allNFIReceiptDBAction());
        dispatch(allStructBCAction());
    }, []);

    //TODO write a funtion to convert chainId into network name
    //TODO add timestamp in my account DB
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedWallet, setSelectedWallet] = useState<BCStruct[]>([]);
    const accountQuery = useGetAllAccountQuery();
    const nfiQuery = useGetIdentityBCQuery();
    // export function nfiBC({ identity }):BCStruct[] {
    // const { data, isLoading, isError, error } = useGetIdentityBCQuery(
    //     ["identityStruct", identity.walletAccount],
    //     () => ExpandedComponent(identity.walletAccount)
    // );

        // const rowsTable = useMemo(() => {
//     const receiptDictionary: NFIReceiptInterface["receipt"] = {};
//     if(getAllStructBCBC !== null){
//         getAllStructBCBC.map((el:BCStruct) => {
//             receiptDictionary[el.allAccountDictionaryDBDB.wallet_chain_Pkey] = el;
//         })
//         console.log('this is the receiptDictionary:', receiptDictionary);
//         const datarow: BCStruct[] = [];
//         receiptDictionary.map((element:any) => {
//             let name = "";
//             let profession = "";
//             let originDateFormatted = "";
//             let identityStruct:BCStruct[] = [];
//             if (Object.prototype.hasOwnProperty.call(receiptDictionary, element.walletAccount)) {
//                 console.log('this is the receiptdictionary walletaccount', receiptDictionary[element.walletAccount])
//                 if (Object.hasOwnProperty.call(receiptDictionary[element.walletAccount],'identityStruct')) {
//                     if (receiptDictionary[element.walletAccount]['identityStruct'].length >= 10) {
//                         identityStruct = receiptDictionary[element.walletAccount]['identityStruct']
//                         name = receiptDictionary[element.walletAccount]['identityStruct'][1].split('|||')[0]
//                         profession = receiptDictionary[element.walletAccount]['identityStruct'][3].split('|||')[0]
//                         const originDate = receiptDictionary[element.walletAccount]['identityStruct'][9]
//                         const originDateObject = new Date(originDate);
//                         originDateFormatted = `${originDateObject.toLocaleString('en-us',
//                             {month: 'long'})} ${originDateObject.getDate()}, ${originDateObject.getFullYear()}`
//                         console.log("this is the origin date from Search", originDate)
//                     }
//                 }
//             }
//             const singleWalletDictionary = {
//                 identityStruct: identityStruct,
//                 walletAccount: element.walletAccount,
//                 name: (name ? name : "non-registered"),
//                 profession: profession,
//                 validations: 0,
//                 originDate: originDateFormatted,
//                 reported: 0,
//             }
//             datarow.push(singleWalletDictionary);
//         })
//         return datarow;
//     }
//     return[];
// }, []);

    type Cols = {
        chain: string,
        creation: number | null,
        wallet: string,
        name: string | undefined,
        origin: string | undefined,
        profession: string | undefined,
        validations: number | undefined,
        validate: string,
        reported: number | undefined,
        report: string
    };
    const data = useMemo((): Cols[] => {
        console.log(accountQuery)
        if (!accountQuery.data) return []
        //TODO not sure I can pull from 'data' on a web3 call
        if (!nfiQuery.data) return []
        return (accountQuery.data.Items.map((el) => {
            console.log("el", el)
            let name = "non-registered account";
            if(el.ownerName && el.ownerName.length > 0){
                name = el.ownerName as string;
            }
            return ({
                chain: el.chainId,
                creation: el.createDate!,
                wallet: el.walletAccount,
                name: name,
                origin: "",
                profession: '',
                validations: el.validations,
                validate: '',
                reported: el.reported,
                report: '',
            })
        }))
    }, [accountQuery])

    const columns: Column<Cols>[] = useMemo(() => [
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Chain </Text>,
            accessor: 'chain',
            Cell: ( el ) =>  <Text fontSize={'12px'} > {el.row.original.chain} </Text>
        },
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Creation Date </Text>,
            accessor: 'creation',
            Cell: ({ value }) =>
            {
                const originDateObject = new Date(value!);
                const originDateFormatted = `${originDateObject.toLocaleString('en-us', {month: 'long'})} ${originDateObject.getDate()}, ${originDateObject.getFullYear()}`
                return   <Text fontSize={'12px'} style={{whiteSpace: 'nowrap'}} > {originDateFormatted} </Text> ;
            }
        },
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Wallet Account </Text>,
            accessor: 'wallet',
            Cell: (el) => {
                return(
                    <Button as={ReachLink} to={`/identity/${el.row.original.chain}/${el.row.original.wallet}`}
                            bg={'#f2eef2'} color={'pmpurple.13'}>
                        <Text isTruncated={true} fontSize={'12px'} > {el.row.original.wallet} </Text>
                    </Button>
                )
            },
            // sortable: true,
            // reorder: true,
            // center: true,
            // grow: 3.2,
            // style: {
            //     backgroundColor: '#f2eef2',
            //     fontWeight: 'bold'
            // },
        },
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Name </Text>,
            accessor: 'name',
            Cell: (el) => {
                return(
                    <Link as={ReachLink} to={`/identity/${el.row.original.chain}/${el.row.original.wallet}`}
                            bg={'#f2eef2'} color={'pmpurple.13'}>
                        <Text fontSize={'12px'} style={{whiteSpace: 'nowrap'}}> {el.row.original.name} </Text>
                    </Link>
                )
            },
         sortable: true,
         reorder: true,
         center: true,
        },
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Origin Date </Text>,
            accessor: 'origin',
        },
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Profession </Text>,
            accessor: 'profession',
        },
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Validations </Text>,
            accessor: 'validations',
        },
        {
            Header:     <Text style={{whiteSpace: 'nowrap'}}> Validate </Text>,
            accessor: 'validate',
            Cell: <Button as={ReachLink} to={'/validate'} color={'pmpurple.13'} bg={'#f2eef2'} fontSize={'12px'}>
                             <MdOutlineLibraryAddCheck fontSize={'16px'}/>
                             <Text fontSize={'12px'} ml={'6px'}> Validate </Text>
                         </Button>,
            sortable: true,
         reorder: true,
         button: true,
            center: true,
        },
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Reported </Text>,
            accessor: 'reported',
        },
        {
            Header: <Text style={{whiteSpace: 'nowrap'}}> Report </Text>,
            accessor: 'report',
            Cell: <Button as={ReachLink} to={'/report'} color={'pmpurple.13'} bg={'#f2eef2'} fontSize={'12px'}>
                             <HiOutlineDocumentReport fontSize={'16px'}/>
                             <Text fontSize={'12px'} ml={'6px'}> Report </Text>
                         </Button>,
        }
    ], [])

    const filteredItems = data.filter(item => {
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
                if (item.origin && item.origin.toLowerCase().includes(filterText.toLowerCase())) {
                    return item;
                }
                if (item.wallet && item.wallet.toLowerCase().includes(filterText.toLowerCase())) {
                    return item;
                }
            }
            if (searchWalletAccount.length !== 0) {
                if (item.wallet && item.wallet.toLowerCase().includes(searchWalletAccount.toLowerCase())
                    && item.name && item.name.toLowerCase().includes(filterText.toLowerCase())) {
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
                                        placeHolder={'wallet accountDB'}
                                        buttonText={'Create'} isOpen={isIdentityModalOpen} onClose={() => {
                        setIdentityModalOpen(false)
                    }}/>
                </HStack>
            </Box>
        );
    }, [filterText, searchWalletAccount, resetPaginationToggle, filteredItems]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data }, useSortBy);

    if (!accountQuery.data) return <div/>
    if (accountQuery.isLoading) return (<Heading>isLoading...</Heading>);
    if (accountQuery.isError) return (
        <Heading>Nooo...something went wrong!<Text>{accountQuery.error.toString()}</Text></Heading>);
    return (
        <Flex
            justifyContent="center"
            flex='auto'
            w={'100%'}
            p={'16px'}
            border={'1px solid blue'}
        >
            <Box
                border={'1px solid'}
                borderColor={'pmpurple.13'}
                bg={'pmpurple.4'}
            >
                <Table {...getTableProps()}>
                    <Thead>
                        {headerGroups.map((headerGroup) => (
                            <Tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <Th
                                        {...column.getHeaderProps()}
                                        // isNumeric={column.isNumeric}
                                    >
                                        {column.render('Header')}
                                        {/*<chakra.span pl='4'>*/}
                                        {/*    {column.isSorted ? (*/}
                                        {/*        column.isSortedDesc ? (*/}
                                        {/*            <TriangleDownIcon aria-label='sorted descending' />*/}
                                        {/*        ) : (*/}
                                        {/*            <TriangleUpIcon aria-label='sorted ascending' />*/}
                                        {/*        )*/}
                                        {/*    ) : null}*/}
                                        {/*</chakra.span>*/}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row)
                            return (
                                <Tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <Td {...cell.getCellProps()}
                                            // isNumeric={cell.column.isNumeric}
                                        >
                                            {cell.render('Cell')}
                                        </Td>
                                    ))}
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Box>
            {/*{JSON.stringify(accountQuery.data.Items)}*/}
            {/*<UnorderedList>*/}
            {/*    {accountQuery.data.Items.map((accountQueryRow)=>(*/}
            {/*            <ListItem*/}
            {/*                key={accountQueryRow.walletAccount}*/}
            {/*                className={"nfiIdentity-account"}*/}
            {/*                // onClick={()=>{setSelectedWallet(accountQueryRow)}}*/}
            {/*            >*/}
            {/*                {accountQueryRow.walletAccount}*/}
            {/*            </ListItem>*/}
            {/*        ))}*/}
            {/*</UnorderedList>*/}
            {/*{JSON.stringify(data)}*/}
            {/*<UnorderedList>*/}
            {/*    {data.map((nfiIdentity)=>(*/}
            {/*        <ListItem*/}
            {/*            key={nfiIdentity.walletAccount}*/}
            {/*            className={"nfiIdentity-account"}*/}
            {/*            onClick={()=>{setSelectedWallet(nfiIdentity)}}*/}
            {/*        >*/}
            {/*            {nfiIdentity.walletAccount}*/}
            {/*        </ListItem>*/}
            {/*    ))}*/}
            {/*</UnorderedList>*/}
            {/*<Box     >*/}
            {/*<DataTable*/}
            {/*    title="Non-Fungible-Identities"*/}
            {/*    columns={columns}*/}
            {/*    data={filteredItems}*/}
            {/*    expandableRows*/}
            {/*    expandableRowsComponent={ExpandedComponent}*/}
            {/*    defaultSortFieldId={5}*/}
            {/*    fixedHeader={true}*/}
            {/*    fixedHeaderScrollHeight={'60vh'}*/}
            {/*    pagination={true}*/}
            {/*    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1*/}
            {/*    subHeader={true}*/}
            {/*    subHeaderComponent={subHeaderComponentMemo}*/}
            {/*    persistTableHead*/}
            {/*    paginationPerPage={12}*/}
            {/*    striped={true}*/}
            {/*    highlightOnHover={true}*/}
            {/*    //selectableRows*/}
            {/*/>*/}
            {/*</Box>*/}
        </Flex>
    )
};

export default Search;


