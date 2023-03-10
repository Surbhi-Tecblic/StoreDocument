import React, { useRef, useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import {
  Box,
  Column,
  Heading,
  Row,
  Stack,
  Text,
  Button,
  SelectList,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';
const StoreDocumentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
import StoreDocumentABI from "../Context/StoreDocument.json";
import { useRouter } from 'next/router'
import { create as ipfsHttpClient } from 'ipfs-http-client'
// const ipfsClient = require('ipfs-http-client');
const projectId = '2HOJiGDa1CaqLJEHkNgqe9smzxy';
const projectSecret = 'ef137d8ad1be6f6808d745feb6b32249';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  "base64"
)}`;
console.log(auth)

const subDomain = "https://tecblic-nft-marketplace.infura-ipfs.io";
const url = "https://tecblic-nft-marketplace.infura-ipfs.io/ipfs/QmWVnhCeRogH16Y7u78o1XFDNLiUGeWpa1g4BJVxGAf1ZD"
  const client = ipfsHttpClient({
    host: "infura-ipfs.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,

    },

  });
  console.log(client)

export default function viewDoc() {
  const [instance, setInstance] = useState(null);
  const viewer = useRef(null);
  

  useEffect(() => {
    loadWebViewer();
  }, []);

  const loadWebViewer = async () => {
    const WebViewer = (await import('@pdftron/webviewer')).default;
    if (viewer.current) {
      WebViewer(
        {
          path: '/lib',
          initialDoc: `/lib/Prerequisite.pdf`,
          disabledElements: [
                    'ribbons',
                    'toggleNotesButton',
                    'searchButton',
                    //'menuButton',
                    'rubberStampToolGroupButton',
                    'stampToolGroupButton',
                    'fileAttachmentToolGroupButton',
                    'calloutToolGroupButton',
                    'undo',
                    'redo',
                    'eraserToolButton'
          ],
        },
        viewer.current
      ).then(instance => {
        // const { iframeWindow } = instance;
        
        instance.setToolbarGroup('toolbarGroup-Insert');
        setInstance(instance)
        // instance.loadDocument()
       
      })
    }
  };


  return (
    <div className="App">
            <div className="header">Tecblic Dapp</div>
            <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
            <Button
                // onClick={UploadPdf}
                accessibilityLabel="complete signing"
                text="Upload document after signature"
                iconEnd="compose"
                fullWidth="100"
            />
            {/* <iframe width="1000" height="1000" src={`https://tecblic-live.infura-ipfs.io/ipfs/${url}`} title="description"></iframe> */}
            
        </div>
  );
}
