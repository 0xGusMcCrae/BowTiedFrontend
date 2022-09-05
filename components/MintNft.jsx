import {useWeb3Contract} from "react-moralis"
import {abi,contractAddresses} from "../constants" //can just do the folder since index.js is in the folder exporting the things
import {useMoralis} from "react-moralis"
import {useEffect, useState} from 'react';
import {ethers} from "ethers"
import {useNotification} from "web3uikit"

export default function MintNft() {
  const {chainId: chainIdHex, isWeb3Enabled} = useMoralis();
  const provider = ethers.getDefaultProvider();
  const chainId = 5;
  const mintAddress = "0x1Cd96dD820Aa2b618122BDCcF6C65557a29b9801" //should try to get this from constants
  const mintContract = new ethers.Contract(mintAddress,abi,provider);
  const [totalSupply, setTotalSupply] = useState("0");
  const [supplyRemaining, setSupplyRemaining] = useState("0");

  const {runContractFunction: mint, isLoading, isFetching} = useWeb3Contract({
    abi: abi,
    contractAddress: mintAddress,
    functionName: "mint",
    params: {},
    msgValue: 0,
  })

  const {runContractFunction: maxSupply} = useWeb3Contract({
    abi: abi,
    contractAddress: mintAddress,
    functionName: "maxSupply",
    params: {},
    msgValue: 0,
  })

  const {runContractFunction: getTokenCount} = useWeb3Contract({
    abi: abi,
    contractAddress: mintAddress,
    functionName: "getTokenCount",
    params: {},
    msgValue: 0,
  })
  

  // Update UI with new supply remaining each time an NFT is minted
  async function updateUi() {
    const totalSupplyfromCall = (await maxSupply()).toString();
    const supplyRemainingfromCall = (totalSupplyfromCall - (await getTokenCount())).toString();
    setTotalSupply(totalSupplyfromCall);
    setSupplyRemaining(supplyRemainingfromCall);
  }
  useEffect(() => {
    if(isWeb3Enabled){
      
      updateUi(); /* do it this way because you cant use await in useEffect since it's not async */
    }
  }, [isWeb3Enabled])

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    //handleNewNotification(tx);
    updateUi();
  }

  //dispatch doesn't work because of some redux update, may try to figure out dependencies eventually, but not a priority
  // const handleNewNotification = () => {
  //   dispatch({
  //     type: "info",
  //     message: "Transaction Complete",
  //     title: "Tx Notification",
  //     positions: "topR",
  //     icon: "bell"
  //   })
  // }

  return(
    <div className="p-5">
      {mintAddress ? (
        <div className="buttonAndInfo">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mintButton"
          onClick={async () => {await mint({
            onSuccess: handleSuccess, //success means successfully sent thru metamask, not successfully transacted
            onError: (error) => console.log(error),
            })
          }}
          disabled={isLoading || isFetching}
        >Mint NFT</button>
          <div className="mintInfo">
              <div>Price: FREE!!!</div>
              <div>Total Supply: {totalSupply}</div>
              <div>Supply Remaining: {supplyRemaining}</div>
          </div>
        </div>
      ) : (
        <div>No Contract Address Detected!!!!!!</div>
      )}
    </div>
  )
}
