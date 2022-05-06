import React, {ReactNode, ReactText, useState, useEffect, ReactElement} from 'react';
import {Route, Routes, useLocation, useParams, useNavigate, Navigate, BrowserRouter} from 'react-router-dom';
import { AiOutlineFileSearch } from "react-icons/ai";
import { GiFlowerPot } from "react-icons/gi";
import { BiHomeHeart, BiBookmarkHeart } from 'react-icons/bi';
import { IoMdCheckmarkCircleOutline, IoMdAttach } from 'react-icons/io';
import {
    IconButton,
    Box,
    Flex,
    Icon,
    Link,
    Text,
    Heading,
    Menu,
    MenuButton,
    Divider,
    Avatar,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import type {FC} from 'react';
import {Link as ReachLink, To} from "react-router-dom";
import Home from "../components/pages/Home";
import CloudHWM from "../components/pages/CloudHWM";


interface InterfaceNavItem {
    title?: string;
    icon?: IconType;
    active?: boolean;
    navItemSize?: string;
    path: To;
}

interface InterfaceSidebar{
    icon?: IconType;
    profileName?: string;
}


export const RoutesRoutes: FC<InterfaceSidebar>= ({icon, profileName} ): ReactElement => {

    return (

        <Flex
            flex={{base: 1, md: 'auto'}}
        >
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path={'/CloudHWM'} element={<CloudHWM/>}/>
            </Routes>
        </Flex>
    )
};

export default RoutesRoutes;



