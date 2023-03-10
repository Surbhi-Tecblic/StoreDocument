
In this admin can add the user who needs to sign after assigning the users admin can add the document. 
//Install metamask 
1 Clone the project locally, change into the directory, and install the dependencies:
#Install Node Modules
   npm install
// cd backend 
   npm install
    
2 Start the local Hardhat node
   npx hardhat node

3 With the network running, deploy the contracts to the local network in a separate terminal window
   npx hardhat run --network localhost scripts/deploy.js

//For Deploying on Mumbai Network 
   npx hardhat run --network mumbai scripts/deploy.js
   
4 Start the app
   npm run dev


