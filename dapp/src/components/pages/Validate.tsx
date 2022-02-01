import * as React from 'react';
import {useState, useEffect} from "react";
import Web3 from "web3";
import type {FC} from 'react';
import MintIdentity from '../../contracts/MintIdentity.json';
import {
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Input,
    Stack,
    Box,
    Button,
    Heading,
    SimpleGrid,
    Text,
    useColorModeValue,
    VisuallyHidden,
    IconButton,
    CloseButton,
    Flex,
    Icon,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
} from '@chakra-ui/react';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';
import { Link } from '../atoms/Link';
import {useAppSelector} from "../../app/hooks";
import { ReactNode, ReactText } from 'react';
import PMLogo from '../../PMGIMPResized.png';
import Logo from '../atoms/Logo';
import Sidebar from "../molecules/Sidebar";


interface Interface {

}

export const Validate: FC<Interface>=()=> {

    return (
        <Flex>
                this page will have the NRC20 NFT mint contract and forum

        </Flex>
    )
};

export default Validate;