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
  const mintAddress = "0x1Cd96dD820Aa2b618122BDCcF6C65557a29b9801"
  //const mintContract = new ethers.Contract(abi,mintAddress,provider);
  const [totalSupply, setTotalSupply] = useState("0");
  const [supplyRemaining, setSupplyRemaining] = useState("0");

  const {runContractFunction: mint, isLoading, isFetching} = useWeb3Contract({
    abi: abi,
    contractAddress: mintAddress,
    functionName: "mint",
    params: {},
    msgValue: 0,
  })
  

  // async function updateUi() {
  //   const totalSupplyfromCall = (await mintContract.maxSupply()).toString();
  //   const supplyRemainingfromCall = (totalSupply - (await getTokenCount())).toString();
  //   setTotalSupply(totalSupplyfromCall);
  //   setSupplyRemaining(supplyRemainingfromCall);
  // }
  // useEffect(() => {
  //   if(isWeb3Enabled){
      
  //     updateUi(); /* do it this way because you cant use await in useEffect since it's not async */
  //   }
  // }, [isWeb3Enabled])

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUi();
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Tx Notification",
      positions: "topR",
      icon: "bell"
    })
  }

  return(
    <div className="p-5">
      {mintAddress ? (
        <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={async () => {await mint({
            onSuccess: handleSuccess, //success means successfully sent thru metamask, not successfully transacted
            onError: (error) => console.log(error),
            })
          }}
          disabled={isLoading || isFetching}
          //he also did some shit for a loading animation but idgaf, just check his code
        >Mint NFT</button>
            Price: FREE!!!
        {/* Total Supply: {totalSupply}
        Supply Remaining: {supplyRemaining} */}
        </div>
      ) : (
        <div>No Contract Address Detected!!!!!!</div>
      )}
    </div>
  )
}
