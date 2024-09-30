import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { connectWallet, getContract, getTokenContract } from "../util/contract";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import './product.css'
import { parseUnits, formatUnits, parseEthers } from 'ethers/utils';
function ProductDetail() {
  const { productID } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [walletBalance, setWalletBalance] = useState('');
  const [allowance, setAllowance] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!window.ethereum.isConnected()) {
          return alert("Please install MetaMask");
        }
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        const product = await contract.getProductByID(productID);

        const formattedProduct = {
          productID: product.productID,
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          ownerAddress: product.ownerAddress,
          sold: product.sold,
          ipfsCID: product.ipfsCID,
        };
        try {
        const seller = await contract.getSellerByAddress(product.ownerAddress);

        const displaySellerFromProduct = {
          name: seller.name,
          bio: seller.bio,
          sellerAddress: seller.sellerAddress,
          productsOwned: seller.productsOwned.toString(),
        };
        setProduct(formattedProduct);
        setSeller(displaySellerFromProduct);
      } catch (error) {
        console.error(error?.message);
        setSeller({ name: "Seller Not Found", bio: "", sellerAddress: "", productsOwned: 0 });
      }
        
      } catch (error) {
        console.error(error?.message);
        alert("Error while getting product: " + error?.message);
      }
    };

    fetchProduct();
  }, [productID]);

  if (!product) {
    return <div>Loading...</div>;
  }

const handlePurchaseProduct = async () => {
  try {
    const { signer } = await connectWallet();
    const contract = getContract(signer);
    const token  = getTokenContract(signer);
    const buyer =  signer.getAddress();
    console.log(buyer);
    token.approve(contract.getAddress(), product.price).then((tx) => {
      return tx.wait();
    }).then(() => {
      console.log("product ID: ", productID, "buyer: ", buyer);
      contract.sellProductByID(productID, buyer);
    }).catch((error) => {
      console.error(error);
    });
  } catch (error) {
    console.error(`Error purchasing product: ${error.message}`);
    alert(`Error purchasing product: ${error.message}`);
  }
};

const handleAllowanceSpending = async (e) => {
  e.preventDefault();
  try {
      if (!window.ethereum.isConnected()) {
          return alert("Please install MetaMask");
      }

      const { signer } = await connectWallet();
      const contract = getContract(signer);


      console.log(seller.sellerAddress, 'is allowed to spend tokens from', (signer.getAddress()).toString());
      const allowance = await contract.allowanceSpending(signer.getAddress(), contract.getAddress());
      
      // Convert allowance back to human-readable format
      const formattedAllowance = formatUnits(allowance, 18);
      console.log(`${signer.getAddress()} is allowed to spend ${formattedAllowance} tokens from ${seller.sellerAddress}`);
      console.log(formattedAllowance);
      setAllowance(formattedAllowance);
  } catch (error) {
      console.error(error?.message);
      alert("Error while fetching allowance: " + error?.message);
  }
};



  const handleViewWalletTokenBalance = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);
      const balance = await contract.viewWalletTokenBalance(signer.getAddress());
      setWalletBalance(balance.toString());
    } catch (error) {
      console.error(error?.message);
      alert("Error while approving spending: " + error?.message);
    }
    }


 

  return (
    <section>
      <main>
      <h2>{product.name}</h2>
        <div className="product-detail">
          <img src={product.ipfsCID} />
          <div className="description">
            <p>Product ID: {product.productID}</p>
            <p>Name: {product.name}</p>
            <p>Description: {product.description}</p>
            <p>Price: <strong>{formatUnits(product.price,18)} DGG </strong>
              <span> From: {product.price}</span>
            </p>
            <p>Owner Address: {product.ownerAddress}</p>
            <p>Status: {product.sold ? "SOLD" : "AVAILABLE"}</p>
            <button className="button-24" onClick={handlePurchaseProduct}>{product.sold ? "Sell Item" : "Purchase Item"}</button>
          </div>
        </div>
        <hr/>
        <div className="middle-grid">
        
         
          <form onSubmit={handleAllowanceSpending}>
            <h2>View Allowance Balance</h2>
            <p>Allowance : {allowance}</p>
            <button type="submit">Get Allowance</button>
          </form>
          <form onSubmit={handleViewWalletTokenBalance}>
          <h2>View Token Balance</h2>
            <h3>Balance: {walletBalance} ({walletBalance/10**18} REA)</h3>
            <p>From: {seller.sellerAddress}</p>
            <button  type="submit">View Balance</button>
          </form>
         
        </div>
        <hr/>

        <div>
          <h2>Seller Profile</h2>
          <p>Name: {seller.name}</p>
          <p>Bio: {seller.bio}</p>
        
        </div>
      </main>
    </section>
  );
}

export default ProductDetail;
