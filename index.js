//in nodejs
//require()

//in frontend javascript can't use require
//import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        fundButton.innerHTML = "Please install MetaMask!"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            //listen for the tx to be mined
            //listen for an event
            await listenForTransactionMine(transactionResponse, provider) //await函数将等待promise完成后再进行后面的代码程序
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    //return new Promise()
    //创建一个区块链监听器
    //等待这个交易的完成
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} comfirmations`,
            )
            resolve() //此处我们完成了区块链监听器的监听，所以调用reslove函数，将promise标记为fulfilled状态
        })
    }) //promise的执行器函数的两个参数是resolve()和reject()，这两个参数是函数，由 JavaScript 引擎提供，不用自己部署。
    //我们在后面的回调函数中调用这两个参数函数，来通知 Promise 对象状态的变更。

    //当你创建一个 Promise 对象时，你需要提供一个执行器函数（executor function），这个函数会立即执行。执行器函数接受两个函数作为参数，通常称为 resolve 和 reject。
    // resolve 函数在异步操作成功时调用，并将成功的结果作为参数传递。
    // reject 函数在异步操作失败时调用，并将错误或失败的原因作为参数传递。

    // provider.once(transactionResponse.hash, (transactionReceipt) => {
    //     console.log(
    //         `Completed with ${transactionReceipt.confirmations} comfirmations`,
    //     )
    // }) //区块链监听器provider.once并不会阻塞函数停止，我们需要将它作为一个函数返回promise
}

//interact with a contract, we need provider, signer, contract abi, contract address
