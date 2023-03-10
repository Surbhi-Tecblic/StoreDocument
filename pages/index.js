import { ethers } from 'ethers'
import React, { useState } from 'react';
import {
    Box,
    Button,
    Toast,
    Container,
    Text,
    TextField,
    Heading,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'


const StoreDocumentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// import StoreDocumentABI from "../Context/StoreDocument.json";



export default function Home() {
   
    

    return (
        <div>
            <Box padding={3}>
               Tecblic Sign APP
            </Box>
        </div>
    )
}

