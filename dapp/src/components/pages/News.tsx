import React from 'react';
import {useState, useEffect} from "react";
import type {FC} from 'react'
import {Box, Flex, Button, FormControl, FormLabel, Grid, GridItem, Input, Stack} from '@chakra-ui/react';
import Sidebar from "../molecules/Sidebar";
import {Route, Routes} from "react-router-dom";



interface Interface {

}

export const News:FC<Interface>=()=>{

    // const NewsForumPage = [
    //     <ForumPageTemplate title={'PaperMaster News'} body={'dfgfdhdftgyertg'}/>,
    //     <ForumPageTemplate title={'New Features'} body={'dfgfdhdftgyertg'}/>,
    //     <ForumPageTemplate title={'Updated Features'} body={'dfgfdhdftgyertg'}/>,
    //     <ForumPageTemplate title={'Future Features'} body={'bdfkljgiuertywrebfbfshjteruerter'}/>,
    // ]

        return (

            <Flex>

                <Flex >
                    <Sidebar/>
                </Flex>
                <Box flex='auto'  style={{border: '8px solid white'}}>

                </Box>
            </Flex>

        )
    };


export default News;