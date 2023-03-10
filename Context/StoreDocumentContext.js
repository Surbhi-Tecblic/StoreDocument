import React, { useEffect, useState,useContext } from 'react';
import { useRouter } from 'next/router';
import {
    checkIfWalletConnected,
    connectWallet,
    connectingWithContract
} from "../Utils/apiFeature";
import { create as ipfsHttpClient } from 'ipfs-http-client'

    const projectId = "2Id5FezPC8jGHivJAOoT5qRVO8H";
    const projectSecretKey = "75dc761840438090384b4d48ba872802";
    
    const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
        "base64"
    )}`;
    console.log(auth)
    
    const subDomain = "https://tecblic-signature-daap.infura-ipfs.io";
    const client = ipfsHttpClient({
        host: "infura-ipfs.io",
        port: 5001,
        protocol: "https",
        headers: {
            authorization: auth,
        },
    });



export const StoreDocumentContext = React.createContext();
export const StoreDocumentProvider = ({ children }) => {
    const router = useRouter();

    // const title = "Hey Welcome to Decentralize Application"
    const [account, setAccount] = useState("");
    const [verifiedLists, setVerifiedList] = useState("");
    const [unverifiedLists, setUnverifiedList] = useState("");
    

    const fetchData = async () => {
        try {
            const contract = await connectingWithContract();
            const connectAccount = await connectWallet();
            setAccount(connectAccount);

            //Fetch Verified List
            const verifiedList = await contract.fetchVerified();
            setVerifiedList(verifiedList);

            //Fetch All UnVerified User
            const unverifiedList = await contract.fetchUnVerified();
            setUnverifiedList(unverifiedList);

        } catch (error) {
            console.log("Error while fetching the user data", error);
        }

    }

    // useEffect(() => {
    //     fetchData();
    // }, []);


    //Upload to IPFS
    
    const uploadToIPFS = async (file) => {
        try {
            const added = await client.add({ content: file });
            console.log(added)
            const url = `${subDomain}/ipfs/${added.path}`;
            console.log(url)
            return url;
            
        } catch (error) {
            console.log("Error Uploading to IPFS");           
        }
    }
    
    const addUserWhoNeedsToSign = async ({ name, email, docHash, router }) => {

        // if(!name || !email || !docHash)
        //     return console.log("Data is Missing")
        
        try {
            const contract = await connectingWithContract();
            const addUser = await contract.user_enter(name, email, docHash);
            await addUser.wait();
            router.push('/')
            window.location.reload();

        } catch (error) {
            console.log("error while adding the user details");
        }
    }

    const adminVerification = async({uid}) =>{
        try {
            const contract = await connectingWithContract()
            const userVerification = await contract.admin_verify(uid)
            // setVerifiedList(userVerification);
            await userVerification.wait();
            window.location.reload();     
        } catch (error) {
            console.log("Verification Failed");
        }
    }



    return (
        <StoreDocumentContext.Provider value={{
            checkIfWalletConnected,
            connectWallet,
            uploadToIPFS,
            addUserWhoNeedsToSign,
            adminVerification,
            account,
            verifiedLists,
            unverifiedLists
        }}>
            {children}
        </StoreDocumentContext.Provider>
    )
}