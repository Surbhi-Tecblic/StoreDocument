import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
// import { create as ipfsHttpClient } from 'ipfs-http-client'
import Router, { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import {
  Box,
  Button,
  Container,
  Heading,
  TextField,
  Table,
  Text,
  Toast,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';


const StoreDocumentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
import StoreDocumentABI from "../Context/StoreDocument.json";

export default function CreateItem() {
  const [assignees, setAssignees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchData = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
      const signer = provider.getSigner()
      let contract = new ethers.Contract(StoreDocumentAddress, StoreDocumentABI.abi, signer)
      const fetchRegUser = contract.Users();
      console.log("Fetch Register Users", fetchRegUser);
    } catch (error) {
      console.log("error while fetching or adding users")
    }
  }
  useEffect(() => {
    fetchData()
    loadAssigners()
  }, [])

  const addUserWhoNeedsToSign = async () => {

    const web3modal = new Web3Modal()
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(StoreDocumentAddress, StoreDocumentABI.abi, signer)
    let addUser = await contract.addUser(name, email)
    await addUser.wait();
    console.log("Successful", addUser);
    let data = await contract.Users()
    const items = await Promise.all(data.map(async i => {
      let item = {

        tokenId: i.id.toString(),
        Name: i.name,
        Email: i.email
      }
      return item
    }))
    setAssignees(items)
    console.log(items)
  }

  const prepare = async (user) => {

    console.log("tokenId", user)

    Router.push({
      pathname: `/viewDoc`,
      query: {
        tokenId: user?.tokenId,
      },
    })
    // Router.push("/viewDoc")
  }

  // async function loadAssigners() {
  //   const web3Modal = new Web3Modal(
  //     // network: "mainnet",
  //     // cacheProvider: true,
  //   )
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()
  //   if (typeof window.ethereum !== 'undefined') {
  //     // await requestAccount();
  //   }
  //   let contract = new ethers.Contract(StoreDocumentAddress, StoreDocumentABI.abi, signer)
  //   const data = await contract.Users();

  //   const items = await Promise.all(data.map(async i => {
  //     let item = {
  //       // OwnerName,
  //       tokenId: i.id.toString(),
  //       Name: i.name,
  //       Email: i.email
  //     }
  //     return item
  //   }))
  //   setAssignees(items)
  //   console.log(items)
  //   // return(account)

  // }
  // const prepare = async () => {
  //   Router.push("/viewDoc")
  // }


  var arr = []
  async function loadAssigners() {
    const web3Modal = new Web3Modal(
      // network: "mainnet",
      // cacheProvider: true,
    )
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    if (typeof window.ethereum !== 'undefined') {
      // await requestAccount();
    }
    let contract = new ethers.Contract(StoreDocumentAddress, StoreDocumentABI.abi, signer)
    const data = await contract.Users();
    console.log("data",data)
    const items = await Promise.all(data.map(async i => {
      let item = {
        tokenId: i.id.toString(),
        Name: i.name,
        Email: i.email
        // userId: i.userId
      }

      // i.name.toString().split(',');
      for (let j = 0; j < i.name.length; j++) {
        let user = i.name.toString().split(',')[j];
        arr.push(user);
        // console.log(arr);
      }
     return item
    }))
    setAssignees(items)
    console.log(items)
    // return(account)

  }
  return (
    <div>
      <Box padding={3}>
        <Container>
          <Box padding={3}>
            <Heading size="md">Who needs to sign?</Heading>
          </Box>
          {/* <Box padding={2}>
            <TextField
              id="id"
              onChange={event => setIds(event.value)}
              placeholder="Enter recipient's id"
              label="id"
              value={ids}
              type="text"
            />
          </Box> */}
          <Box padding={2}>
            <TextField
              id="displayName"
              onChange={event => setName(event.value)}
              placeholder="Enter recipient's name"
              label="Name"
              value={name}
              type="text"
            />
          </Box>
          <Box padding={2}>
            <TextField
              id="email"
              onChange={event => setEmail(event.value)}
              placeholder="Enter recipient's email"
              label="Email"
              value={email}
              type="email"
            />
          </Box>
          <Box padding={2}>
            <Button
              onClick={() => {
                addUserWhoNeedsToSign(name, email);
              }}
              text="Add user"
              color="blue"
              inline
            /> <br /> <br />

          </Box>

          <Box padding={2}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <Text weight="bold">Name</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Email</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Actions</Text>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {/* {assignees.map(user => (
                  <Table.Row key={user.tokenId}>
                    <Table.Cell>
                      <Text>{user.name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{user.email}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))} */}
                {assignees.map((user, i) => (
                  <Table.Row key={user.id}>
                  <Table.Cell>
                    <Text>{
                    user.Name.toString()}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{user.Email.toString()}</Text>
                  </Table.Cell>
                  <Table.Cell>
                  <Button onClick={ () => prepare(user)} text="Continue" color="blue" inline />
                  </Table.Cell>
                </Table.Row>
                ))}
                <div id='table'></div>
              </Table.Body>
            </Table>
          </Box>
          <Box padding={2}>
            {/* <Button onClick={prepare} text="Continue" color="blue" inline /> */}
          </Box>
          <Box
            fit
            dangerouslySetInlineStyle={{
              __style: {
                bottom: 50,
                left: '50%',
                transform: 'translateX(-50%)',
              },
            }}
            paddingX={1}
            position="fixed"
          >
            {/* {showToast && (
              <Toast color="red" text={<>Please add at least one user</>} />
            )} */}
          </Box>
        </Container>
      </Box>
    </div>
  )
} 