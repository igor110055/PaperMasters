import * as React from 'react';
import type {FC} from 'react';
import {Link as ReachLink, useParams} from "react-router-dom";
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Icon,
    Image,
    Link,
    MenuItem,
    Stack,
    Switch,
    Text,
    VStack,
    HStack,
    Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import {useEffect, useMemo, useReducer, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {FaCube} from "react-icons/fa";
import {MdOutlineEmail} from "react-icons/md";
import DrawerComponent from "./DrawerComponent";
import {SocialMedia} from "./SocialMedia";
import {AccountDBInterface, ParamsURLInterface} from "../../../features/accountDB/AccountDBSlice.types";
import {postSingleAccountDictionaryDBAction} from "../../../features/accountDB/AccountDBSlice";

function initialState(paramsRequestAccountDictionary:any) {
        return {
            ownerName: "",
            ownerEmail: "",
            ownerDescription: "",
            aliasProfileLinks: ""
        };
}

function reducer(state:any, action:any) {
    switch (action.type) {
        case 'name':
            return {...state, ownerName: action.payload};
        case 'email':
            return {...state, ownerEmail: action.payload};
        case 'description':
            return {...state, ownerDescription: action.payload};
        case 'aliasProfileLinks':
            return {...state, aliasProfileLinks: action.payload};
        default:
            throw new Error();
    }
}

interface mailToInterface{
    email: string,
    subject: string,
    body: string,
    children: any,
}

export const Mailto:FC<mailToInterface> = ({ email, subject, body, ...props })=> {
    return (
        <a href={`mailto:${email}?subject=${subject || ""}&body=${body || ""}`}>
            {props.children}
        </a>
    );
}

export const Header:FC = ()=> {
    const paramsWalletWallet = useAppSelector((state) => state.accountDB.paramsWallet);
    const chainIdProviderProvider = useAppSelector((state)=>state.accountBC.chainIdProvider);
    const addressHasIdentityBoolBool = useAppSelector((state) => state.accountBC.addressHasIdentityBool);
    const singleNFIReceiptDBDB = useAppSelector((state) => state.accountDB.singleNFIReceiptDB);
    const getStructBCBC = useAppSelector((state) => state.accountBC.getStructBC);
    const singleAccountDictionaryDBDB = useAppSelector((state) => state.accountDB.singleAccountDictionaryDB);

    const [state, dispatchAccountProfileDictionary] = useReducer(reducer, singleAccountDictionaryDBDB, initialState);
    console.log('this is the state in my useReducer:', state);
    const dispatch = useAppDispatch();

    const submitHandler = () => {
        const accountProfileDictionary: AccountDBInterface = {
            chainId: chainIdProviderProvider as string,
            walletAccount: paramsWalletWallet as string,
            createDate: null,
            ownerName: state.ownerName,
            ownerEmail: state.ownerEmail,
            ownerDescription: state.ownerDescription,
            socialMediaLinks: state.socialMediaLinks,
            emailValidationNotification: false,
            emailReportNotification: false
        }
        dispatch(postSingleAccountDictionaryDBAction(accountProfileDictionary));
        onClose();
    }

    const {isOpen, onOpen, onClose} = useDisclosure()
    const firstField = useRef<HTMLTextAreaElement>(null)
    const [resize, setResize] = useState('horizontal')

    const logicTransactionHashMemo = useMemo(() => {
        console.log(paramsWalletWallet, addressHasIdentityBoolBool, getStructBCBC)
        if (paramsWalletWallet.length > 0 && addressHasIdentityBoolBool && getStructBCBC !== undefined) {
            if(singleNFIReceiptDBDB.transactionHash !== undefined){
                if(singleNFIReceiptDBDB.transactionHash.length){
                    return (
                        <Text fontSize={'16px'} color={'pmpurple.10'} letterSpacing={'1px'}
                              textShadow={'#F7FAFC 0px 0px 10px'}>
                            <Link href={`https://etherscan.io/tx/${singleNFIReceiptDBDB.transactionHash}` }>
                            {singleNFIReceiptDBDB.transactionHash}
                            </Link>
                        </Text>
                    )
                }
            }
        }
        if (addressHasIdentityBoolBool){
            return (
                <Text fontSize={'16px'} color={'pmpurple.13'} letterSpacing={'1px'}
                          textShadow={'#F7FAFC 0px 0px 10px'}>
                    Registered Wallet Account
                </Text>
            )
        }
            return (
                <Text fontSize={'16px'} color={'red.600'} letterSpacing={'1px'}
                          textShadow={'#F7FAFC 0px 0px 10px'}>
                    Non-Registered Wallet Account
                </Text>
            )
    }, [paramsWalletWallet, addressHasIdentityBoolBool, getStructBCBC, singleNFIReceiptDBDB])

    const logicNameMemo = useMemo(() => {
        console.log(singleAccountDictionaryDBDB, paramsWalletWallet, addressHasIdentityBoolBool, getStructBCBC)
        if(addressHasIdentityBoolBool && getStructBCBC !== undefined && singleAccountDictionaryDBDB.ownerName !== undefined ) {
            if(singleAccountDictionaryDBDB.ownerName.length > 0 ) {
                return (
                    singleAccountDictionaryDBDB['ownerName']
                )
            }
        }
        if(addressHasIdentityBoolBool && getStructBCBC !== undefined ){
            // if(getStructBCBC.hasOwnProperty('identityStruct') && getStructBCBC['identityStruct'].length > 0
            //     && getStructBCBC['identityStruct'][1].length > 0 ) {
            //     if(getStructBCBC.identityStruct[1].split("|||")[0].length > 0 ){
            //         return (
            //             getStructBCBC.identityStruct[1].split("|||")[0]
            //         )}
            // }
        }
        return (
            paramsWalletWallet
        );
    }, [singleAccountDictionaryDBDB, paramsWalletWallet, addressHasIdentityBoolBool, getStructBCBC])
    const logicEmailMemo = useMemo(() => {
        if(addressHasIdentityBoolBool && getStructBCBC !== undefined && singleAccountDictionaryDBDB.ownerEmail !== undefined ){
                return(
                    <Mailto
                        email={singleAccountDictionaryDBDB['ownerEmail']}
                        subject="Hello PaperMaster"
                        body="Nice to meet you PaperMaster!">
                        <MdOutlineEmail fontSize={'20px'} color={'#5c415c'}/>
                    </Mailto>
                )
            }
        if(addressHasIdentityBoolBool && getStructBCBC !== undefined ){
            // if(getStructBCBC[3] !== null && getStructBCBC[3].length > 0)
            // if(Object.prototype.hasOwnProperty.call(getStructBCBC, getStructBCBC[3])
            //     && getStructBCBC['identityStruct'][3].length > 0 ) {
            //     return (
            //         <Mailto
            //             email={getStructBCBC[3].split("|||")[0]}
            //             //email={getStructBCBC.identityStruct[3].split("|||")[0]}
            //             subject="Hello PaperMaster"
            //             body="Nice to meet you PaperMaster!">
            //             <MdOutlineEmail fontSize={'20px'} color={'#5c415c'}/>
            //         </Mailto>
            //     )
            // }
        }
        return (
            <MdOutlineEmail fontSize={'20px'} color={'#5c415c'}/>
        );
    }, [paramsWalletWallet, addressHasIdentityBoolBool, getStructBCBC])

    return (
        <Flex
            direction={{ sm: "column", md: "row" }}
            //w={{ sm: "90%", xl: "95%" }}
            align='center'
            left={'10px'}
            right={'10px'}
            justifyContent={{sm: "center", md: "space-between"}}
            backdropFilter="saturate(100%) blur(50px)"
            position="absolute"
            boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
            border="2px solid "
            borderColor='pmpurple.13'
            p="18px"
            pr={'38px'}
            borderRadius="20px"
            transform={{
                sm: "translateY(45%)",
                md: "translateY(90%)",
                lg: "translateY(75%)",
            }}
        >
            <DrawerComponent/>

            <Flex
                mb={{ sm: "10px", md: "0px" }}
                direction={{ sm: "column", md: "row" }}
                w={{ sm: "100%" }}
                textAlign={{ sm: "center", md: "start" }}
                align="center"
                bg={'transparent'}
                //border="2px solid yellow"
                m={"0px"}
                p={'0px'}
>
                <Avatar
                    me={{md: "22px"}}
                    src='' //this is the profile image
                    w="90px"
                    h="90px"
                    mb={"6px"}
                    borderRadius="10px"
                />
                <Stack>
                    <Flex direction="column"
                          maxWidth="100%"
                          m={"0px"}
                          p={'0px'}
                          h={'100%'}
                        //border="2px solid purple"
                    >
                        <Box
                            //border={'1px solid blue'}
                            p={'2px'}
                            my={'0px'}
                        >
                            <HStack
                                spacing={4}
                            >
                                <Box
                                    //border={'1px solid blue'}
                                    pt={'4px'}
                                    my={'0px'}
                                >
                                    <Text
                                        fontSize={'18px'}
                                        color='pmpurple.13'
                                        fontWeight="semibold"
                                    >
                                {logicNameMemo}
                                    </Text>
                                </Box>

                                <Box
                                    //border={'1px solid blue'}
                                    pt={'6px'}
                                    my={'0px'}
                                >
                                {logicEmailMemo}
                                </Box>
                            </HStack>
                        </Box>
                        <SocialMedia/>
                        {/*{logicQRCodeMemo}*/}
                    </Flex>
                </Stack>
            </Flex>
            <Flex
                align="center"
                direction={{sm: "column", md: "row"}}
                w={{sm: "100%"}}
                //textAlign={'right'}
                bg={'transparent'}
                //border="2px solid purple"
                m={"0px"}
                p={'0px'}
                maxWidth="100%"
                h="100%"
                justify={'right'}
            >

                <VStack direction={'row'} justify={'right'} spacing={6}
                    //border="2px solid purple"
                >
                        <Button
                            //border="2px solid purple"
                            p="0px" bg="transparent" _hover={{bg: "none"}}

                        >
                            <Flex
                                align="right"
                                w={'100%'}
                                bg="hsla(0,0%,100%,.3)"
                                borderRadius="15px"
                                justifyContent="right"
                                mt={'0px'}
                                py="12px"
                                px="14px"
                                mx={'0px'}
                                boxShadow="inset 0 0 1px 1px hsl(0deg 0% 100% / 90%), 0 20px 27px 0 rgb(0 0 0 / 5%)"
                                border="1px solid gray.500"
                                cursor="pointer"
                                _hover={{
                                    transform: 'translateY(4px)',
                                    //boxShadow: 'md',
                                }}
                            >

                                    <Icon as={FaCube} me="6px" />
                                    <Text fontSize="sm" color='pmpurple.13' fontWeight="bold">
                                        {/*TODO: when I click on this button I want it to route me to the registration & validations page*/}

                                            {logicTransactionHashMemo}

                                    </Text>
                            </Flex>
                        </Button>

                    <HStack spacing={'34px'}>
                        {/*<Stack spacing={'0px'} align={'center'}>*/}
                        {/*    <Text fontWeight={600}>57</Text>*/}
                        {/*    <Tooltip hasArrow label='Total received Validations from other Blockchain accounts'*/}
                        {/*             bg='pmpurple.4' color='pmpurple.13'>*/}
                        {/*        <Text fontSize={'sm'} color={'pmpurple.11'}>*/}
                        {/*            Validations*/}
                        {/*        </Text>*/}
                        {/*    </Tooltip>*/}
                        {/*</Stack>*/}
                        {/*<Stack spacing={0} align={'center'}>*/}
                        {/*    <Text fontWeight={600}>23k</Text>*/}
                        {/*    <Tooltip hasArrow label='Total MentionsNew about PaperMaster' bg='pmpurple.4'*/}
                        {/*             color='pmpurple.13'>*/}
                        {/*        <Text fontSize={'sm'} color={'pmpurple.11'}>*/}
                        {/*            MentionsNew*/}
                        {/*        </Text>*/}
                        {/*    </Tooltip>*/}
                        {/*</Stack>*/}
                        <Stack spacing={0} align={'center'}>
                            <Text fontWeight={600}>(SWAN NFT goes there) 23k</Text>
                            <Tooltip hasArrow label='Total reports made about PaperMaster' bg='pmpurple.4'
                                     color='pmpurple.13'>
                                <Text fontSize={'sm'} color={'pmpurple.11'}>
                                    Validations
                                </Text>
                            </Tooltip>
                        </Stack>
                        <Stack spacing={0} align={'center'}>
                            <Text fontWeight={600}>3k</Text>
                            <Tooltip hasArrow
                                     label='Number of Validations PaperMaster has given to other Blockchain accounts'
                                     bg='pmpurple.4' color='pmpurple.13'>
                                <Text fontSize={'sm'} color={'pmpurple.11'}>
                                    Gifted Validations
                                </Text>
                            </Tooltip>
                        </Stack>
                    </HStack>
                </VStack>
            </Flex>
        </Flex>

    )
};

export default Header;