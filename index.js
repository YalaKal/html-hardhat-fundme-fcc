import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    console.log("Connected to Metamask")
    connectButton.innerHTML = "Connected"
  } else {
    connectButton.innerHTML = "Please Install Metamask"
  }
}

// fund function
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    // provider / connection to th blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // signer /wallet / someone with some gas
    const signer = provider.getSigner()

    // contract that we interacting with
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const txResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTxMine(txResponse, provider)
      console.log("Done!")
    } catch (e) {
      console.log(e)
    }
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)

    console.log(`Contract Balance: ${ethers.utils.formatEther(balance)}`)
  }
}

function listenForTxMine(txResponse, provider) {
  console.log(`Mining ${txResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (txReceipt) => {
      console.log(`Completed with ${txReceipt.confirmations} confirmations...`)
      resolve()
    })
  })
}

// withdraw function
async function withdraw() {
  if ((typeof window, ethereum !== "undefined")) {
    console.log("*** Withdrawing money from the contract ***")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const txResponse = await contract.withdraw()
      // await listenForTxMine(txResponse, provider)
      console.log("*** Done Withdrawing ***")
    } catch (error) {
      console.log(error)
    }
  }
}
