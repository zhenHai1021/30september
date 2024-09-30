import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { connectWallet, getContract } from "../util/contract";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

function ProductDetail() {
  const { productID } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

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
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);
      const buyer = signer.getAddress();
      console.log('test');
      console.log(signer.getAddress());
      await contract.sellProductByID(productID, buyer);
      alert("Product purchased successfully and added to " , buyer);

    } catch (error) {
      console.error(error?.message);
      alert("Error while adding product: " + error?.message);
    }
  };

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
            <p>Price: {product.price}</p>
            <p>Owner Address: {product.ownerAddress}</p>
            <p>Status: {product.sold ? "SOLD" : "AVAILABLE"}</p>
            <button className="button-24" onClick={handlePurchaseProduct}>Purchase Item</button>
          </div>
        </div>

        
      </main>
    </section>
  );
}

export default ProductDetail;
