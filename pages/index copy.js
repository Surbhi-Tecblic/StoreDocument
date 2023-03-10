import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
// import axios from 'axios'
import Web3Modal from 'web3modal'

const StoreDocumentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
import StoreDocumentABI from "../Context/StoreDocument.json";


export default function Home() {
    const [data, setData] = useState("")
    const [currentAccount, setCurrentAccount] = useState("");
    const fetchUnverifiedUsers = async () => {


        const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
        const signer = provider.getSigner()
        console.log(signer)


        let contract = new ethers.Contract(StoreDocumentAddress, StoreDocumentABI.abi, signer)
        console.log(contract)
        // let listingPrice = await contract.getListingPrice()
        // listingPrice = listingPrice.toString()
        let transaction = await contract.fetchUnVerified();
        // debugger;
        console.log(transaction)
        console.log("eeeeeeeeeee", transaction[0].email)
        console.log("eeeeeeeeeee", transaction[0].id?._hex)


        setData([...transaction]);

    }

   
    useEffect(() => {
        // checkIfWalletConnected();
        fetchUnverifiedUsers();
    }, []);

    return (
        <div className="flex justify-center">
            <div className="p-4">
                <div class="flex justify-center">

                    {data && data.map((_, i) => (

                        <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                            <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">Users List</h5>
                            <p class="text-gray-700 text-base mb-4">

                                <img src={data[i]?.document_link} />
                                <div>
                                    {data[i]?.id?._hex}
                                </div>

                                <div>
                                    {data[i]?.email?.map(e => e).join(", ")}
                                </div>

                                <div>
                                    {data[i]?.name?.map(e => e).join(", ")}
                                </div>

                            </p>
                            <button type="button" class=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Verify</button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

