import * as React from 'react';
import type {FC} from 'react';
import {Link as ReachLink, useNavigate, useParams} from "react-router-dom";
import {
    Box, Button, Flex, Stack, Text, HStack, Divider, Heading, Spacer, useDisclosure,
} from "@chakra-ui/react";
import { RiShareForwardLine} from 'react-icons/ri';
import {useAppSelector, useAppDispatch} from "../../app/hooks";
import AvatarNFI from "../AvatarNFI";
import bgImage from '../../assets/legoLavendarheadercroped.png'
import {FormEvent, useEffect, useMemo, useReducer, useState} from "react";
import Header, {Mailto} from "./identity/Header";
import Projects from "./identity/Projects";
import ValidationsReports from "./identity/ValidationsReports";
import ModalForIdentNoUseParams from './identity/ModalForIdentNoUseParams';
import {AccountLedger} from './identity/AccountLedger'
import {apiHarmonyOneAction} from "../../features/accountBC/ledger/LedgerSlice";
import {ParamsURLInterface} from "../../features/accountDB/AccountDBSlice.types";
import {
    paramsChainId,
    paramsWallet,
    singleAccountDictionaryDBAction,
    singleNFIReceiptDBAction
} from "../../features/accountDB/AccountDBSlice";
import {FaPlus} from "react-icons/fa";
import MentionsDrawer from "./identity/mentions/MentionsDrawer";
import {AiOutlineComment} from "react-icons/ai";
import Mentions from "./identity/mentions/Mentions";
import {useGetMentionQuery, useGetSingleIdentityBCQuery} from "../../features/reactQuery/RTKQuery";

export const Identity:FC=()=> {
//TODO as soon as they connect - redirect them to their identity page - this is important for the hasIdentityBool slice to work
    const {chainId, walletAcc} = useParams();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (walletAcc !== undefined && walletAcc !== "" && walletAcc !== 'undefined') {
            dispatch(paramsChainId(chainId));
            dispatch(paramsWallet(walletAcc));
            dispatch(apiHarmonyOneAction(walletAcc));
            dispatch(singleAccountDictionaryDBAction({
                chainIdURL: chainId,
                paramsWalletURL: walletAcc
            } as ParamsURLInterface))
        }
        dispatch(singleNFIReceiptDBAction({chainIdURL: chainId, paramsWalletURL: walletAcc} as ParamsURLInterface))
    }, [walletAcc, chainId]);

    const chainIdProviderProvider = useAppSelector((state) => state.accountBC.chainIdProvider);
    const addressHasIdentityBoolBool = useAppSelector((state) => state.accountBC.addressHasIdentityBool);
    const singleStructBC = useAppSelector((state) => state.accountBC.getStructBC);
    const singleAccountDictionaryDBDB = useAppSelector((state) => state.accountDB.singleAccountDictionaryDB);
    //const singleNFIReceiptDBDB = useAppSelector((state) => state.accountDB.singleNFIReceiptDB);
    const useGetSingleIdentityBCQueryQuery = useGetSingleIdentityBCQuery({
        chainIdURL: chainId!,
        paramsWalletURL: walletAcc!
    });
    console.log('dataIdentity:', useGetSingleIdentityBCQueryQuery)

    const logicDescriptionMemo = useMemo(() => {
        console.log(singleAccountDictionaryDBDB, walletAcc, addressHasIdentityBoolBool, singleStructBC)
        if (addressHasIdentityBoolBool && singleStructBC !== undefined && singleAccountDictionaryDBDB.ownerDescription !== undefined) {
            if (singleAccountDictionaryDBDB.ownerDescription.length > 0) {
                return (
                    singleAccountDictionaryDBDB['ownerDescription']
                )
            }
        }
        // if (addressHasTokenBoolBool && singleStructBC !== undefined) {
        //     if (Object.prototype.hasOwnProperty.call(singleStructBC,'identityStruct') && singleStructBC['identityStruct'].length > 0 && requestReceiptUsingParams['identityStruct'][7].length > 0) {
        //         if (singleStructBC.[7].split("|||")[0].length > 0) {
        //             return (
        //                 singleStructBC.identityStruct[7].split("|||")[0]
        //             )
        //         }
        //     }
        // }
        return (
            " Mathematics may not teach us how to add love or subtract hate, but it gives us every reason to hope that every problem has a solution.  -Anonymous"
        );
    }, [singleAccountDictionaryDBDB, walletAcc, addressHasIdentityBoolBool, singleStructBC])

    const {isOpen, onOpen, onClose} = useDisclosure()
    if (!chainId) return null;
    return (
        <Box
            //border={'4px solid red'}
            //borderRadius='15px'
            px='0px'
            display='flex'
            flexDirection='column'
            //align='center'
        >
            {walletAcc !== undefined && walletAcc !== 'undefined' && walletAcc !== "" && walletAcc.length !== 0 ?
                <Stack
                    //border={'4px solid yellow'}
                >
                    <Box
                        bgImage={bgImage}
                        w="100%"
                        h="200px"
                        bgPosition="0%"
                        bgRepeat="repeat"
                        position="relative"
                        display="flex"
                        justifyContent="center"
                        mb={'60px'}
                        top={'0px'}
                        right={'0px'}
                        left={'0px'}
                        backgroundPosition="center"
                        objectFit={'cover'}
                        //border={'4px solid blue'}
                    />
                    <Header/>
                    <Stack p={'10px'}
                        //border={'4px solid blue'}
                    >
                        <Box borderRadius='15px' bg='white' p="12px" px="24px" overflow={'none'}>
                            {/*<Heading p="12px 5px" mb="0px">*/}
                            {/*    <Text fontSize="16px" color='pmpurple.13' fontWeight="bold" align={'left'}>*/}
                            {/*        Description*/}
                            {/*    </Text>*/}
                            {/*</Heading>*/}
                            <Box px="5px"
                                //justifyContent={'space-evenly'}
                                //alignItems={'flex-start'}
                                //alignContent={'space-evenly'}
                            >
                                <Flex direction="column">
                                    <Text fontSize="md" color={'pmpurple.13'} fontWeight="400"
                                          align={'left'}>
                                        {logicDescriptionMemo}
                                    </Text>
                                </Flex>
                            </Box>
                        </Box>
                        <Box>
                            <HStack spacing={'10px'}
                                    align='stretch'
                                    justify={'space-evenly'}
                                    minH={"400px"}
                            >
                                <Box w='38%' borderRadius='15px' bg='white' p="16px" overflow={'none'}
                                     whiteSpace={"pre-line"}
                                >
                                    <ValidationsReports/>
                                </Box>

                                <Box w='380px' borderRadius='15px' bg='white'
                                     px="16px"
                                     py={'28px'}
                                     overflow={'none'} whiteSpace={'break-spaces'}
                                >
                                    {useGetSingleIdentityBCQueryQuery.isSuccess ?
                                        <AvatarNFI
                                            walletAccount={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.walletAccount}
                                            name={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.name.split("|||")[0]}
                                            nameColor={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.name.split("|||")[1]}
                                            email={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.email.split("|||")[0]}
                                            emailColor={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.email.split("|||")[1]}
                                            profession={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.profession.split("|||")[0]}
                                            professionColor={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.profession.split("|||")[1]}
                                            organization={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.organization.split("|||")[0]}
                                            organizationColor={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.organization.split("|||")[1]}
                                            slogan={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.slogan.split("|||")[0]}
                                            sloganColor={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.slogan.split("|||")[1]}
                                            website={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.website.split("|||")[0]}
                                            websiteColor={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.website.split("|||")[1]}
                                            uniqueYou={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.uniqueYou.split("|||")[0]}
                                            uniqueYouColor={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.uniqueYou.split("|||")[1]}
                                            avatarBG={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.bgRGB}
                                            originDate={useGetSingleIdentityBCQueryQuery.data!.nfiIdentity!.originDate.toNumber() * 1000}
                                        />
                                        :
                                        <Button
                                            as={ReachLink}
                                            to={'/register'}
                                            w={'100%'}
                                            bg={'pmpurple.2'}
                                            h='10.00rem'
                                            //size='lg'
                                            borderRadius={'20px'}
                                            borderStyle={'4px solid'}
                                            borderColor={'pmpurple.6'}
                                            textDecoration={'none'}
                                            cursor={'pointer'}
                                            alignItems={'center'}
                                            _hover={{
                                                transform: 'translateY(-2px)',
                                                boxShadow: 'xl',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <Text p='12px' textAlign={'center'} fontSize="xl"
                                                  color={'pmpurple.13'}
                                                  fontWeight="bold" whiteSpace={'pre-wrap'}>
                                                NFI will display here, please mint an NFI to your wallet account
                                            </Text>
                                            <Box position={"absolute"} bottom={'10px'} right={"10px"}
                                                 color={'pmpurple.13'}>
                                                <RiShareForwardLine fontSize={'40px'}/>
                                            </Box>
                                        </Button>
                                    }
                                </Box>
                                <Box w='38%' borderRadius='15px' bg='white' p="12px" pb={'16px'}
                                     overflow={'none'}
                                     whiteSpace={"pre-line"}
                                >
                                    <Box
                                        overflow={'hidden'}
                                        whiteSpace={"pre-line"}
                                        h={'100%'}
                                        //w={'30vW'}
                                        //border={'4px solid blue'}
                                    >
                                        {chainIdProviderProvider === '1666600000' ?
                                            <Text mb={'5px'} fontSize="16px" color={'pmpurple.13'} align={'center'}>
                                                Harmony Ledger
                                            </Text>
                                            :
                                            <Text mb={'5px'} fontSize="17px" color={'pmpurple.13'} align={'center'}>
                                                Ethereum Ledger
                                            </Text>
                                        }
                                        <Divider
                                            border={'1px solid'}
                                            borderColor={'pmpurple.8'}
                                        />
                                        <AccountLedger/>
                                    </Box>
                                </Box>
                            </HStack>
                        </Box>
                        <Stack
                            //maxH={'455px'}
                            //border={'1px solid blue'}
                            direction={{base: 'column', md: 'row'}}
                        >
                            <Flex
                                flexDirection={'column'}
                                w={'50%'}
                                p="16px"
                                //my="24px"
                                //mx={{xl: '32px'}}
                                borderRadius='15px'
                                bg='white'
                                px="24px"
                                //border={'1px solid red'}
                                maxH={'455px'}
                            >
                                <Box
                                    display='flex'
                                    //border={'1px solid green'}
                                    // borderBottom={'1px solid'}
                                    // borderColor={'pmpurple.6'}
                                >
                                    <HStack
                                        w={'100%'}
                                    >
                                        <Heading mb="18px">
                                            <Flex direction="column">
                                                <Text mb={'5px'} fontSize="18px" color={'pmpurple.13'} fontWeight="bold"
                                                      align={'left'}>
                                                    Projects
                                                </Text>
                                                <Text fontSize="15px" color={'pmpurple.13'} fontWeight="400"
                                                      align={'left'}>
                                                    PaperMasters protect the Blockchain
                                                </Text>
                                            </Flex>
                                        </Heading>
                                        <Spacer/>
                                        <Button
                                            //style={{border: '1px solid #b59eb5'}}
                                            px="6px"
                                            py={'4px'}
                                            //bg="transparent"
                                            color={'pmpurple.13'}
                                            border="1px solid"
                                            borderColor={'pmpurple.2'}
                                            //borderRadius="15px"
                                            //minHeight={{sm: "200px", md: "100%"}}
                                            rightIcon={<FaPlus fontSize="10px"/>}
                                        >
                                            <Text fontSize="sm" fontWeight="bold">
                                                Add Project
                                            </Text>
                                        </Button>
                                    </HStack>
                                </Box>
                                <Divider
                                    border={'1px solid'}
                                    borderColor={'pmpurple.8'}/>
                                <Projects/>
                            </Flex>
                            <Flex
                                flexDirection={'column'}
                                w={'50%'}
                                p="16px"
                                //my="24px"
                                //mx={{xl: '32px'}}
                                borderRadius='15px'
                                bg='white'
                                px="24px"
                                //border={'1px solid red'}
                                maxH={'455px'}
                            >
                                <Box
                                    display='flex'
                                    //border={'1px solid green'}
                                    // borderBottom={'1px solid'}
                                    // borderColor={'pmpurple.6'}
                                >
                                    <HStack
                                        w={'100%'}
                                        //border={'4px solid red'}
                                    >
                                        <Heading mb="18px">
                                            <Flex direction="column">
                                                <Text mb={'5px'} fontSize="18px" color={'pmpurple.13'} fontWeight="bold"
                                                      align={'left'}>
                                                    Mentions
                                                </Text>
                                                <Text fontSize="15px" color={'pmpurple.13'} fontWeight="400"
                                                      align={'left'}>
                                                    Give a Mention
                                                </Text>
                                            </Flex>
                                        </Heading>
                                        <Spacer/>
                                        <Button
                                            //border={'4px solid blue'}
                                            px="6px"
                                            py={'4px'}
                                            //bg="transparent"
                                            color={'pmpurple.13'}
                                            border="1px solid"
                                            borderColor={'pmpurple.2'}
                                            //borderRadius="15px"
                                            //minHeight={{sm: "200px", md: "100%"}}
                                            onClick={() => {
                                                onOpen()
                                            }}
                                            rightIcon={<AiOutlineComment fontSize="18px"/>}
                                        >
                                            <Text fontSize="sm" fontWeight="bold">
                                                Mentions
                                            </Text>
                                        </Button>
                                        <MentionsDrawer
                                            chainIdURL={chainId}
                                            paramsWalletURL={walletAcc}
                                            mentionsFullDisplayWindowBool={false}
                                            onOpenOpen={onOpen}
                                            isOpenOpen={isOpen}
                                            onCloseClose={onClose}
                                        />
                                    </HStack>
                                </Box>
                                <Divider
                                    border={'1px solid'}
                                    borderColor={'pmpurple.8'}/>
                                <Mentions
                                    chainIdURL={chainId}
                                    paramsWalletURL={walletAcc}
                                />
                            </Flex>
                        </Stack>
                    </Stack>
                </Stack>
                :
                <ModalForIdentNoUseParams/>
            }
        </Box>
    )
};

export default Identity;

