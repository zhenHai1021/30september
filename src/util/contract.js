import {ethers} from 'ethers';
import {contractAddress, tokenAddress, tokenABI} from '../const'
import contract from '../artifacts/contracts/DigitalGoods.sol/DigitalGoods.json';

const abi = contract['abi'];

export const connectWallet = async () =>{
    let provider=null;
    let signer=null;
    let account = '';

    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts');
    account = accounts?.length > 0 ? accounts[0] : '';
    signer = await provider?.getSigner();
    return {provider, signer, account}
}

export const getContract = (signer) =>{
    return new ethers.Contract(contractAddress, abi, signer)
}

export const getTokenContract= (signer)=>{
    return new ethers.Contract(tokenAddress, tokenABI, signer)
}
