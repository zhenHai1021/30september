import React, { useState, useEffect } from "react";
import { connectWallet, getContract } from "../util/contract";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import "./admin.css";
import { parseUnits, formatUnits } from 'ethers/utils';

const accountAtom = atomWithStorage("account", "");
const sellerAtom = atomWithStorage("seller", []);
const productAtom = atomWithStorage("product", []);
function Admin() {
  const [account, setAccount] = useAtom(accountAtom);

  //FOR PRODUCT
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [products, setProducts] = useAtom(productAtom);
  const [productId, setProductId] = useState("");
  const [ipfsCID, setIpfsCID] = useState("");

  //FOR SELLER
  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerBio, setSellerBio] = useState("");
  const [sellers, setSellers] = useAtom(sellerAtom);
  const [sellerId, setSellerId] = useState("");

  const handleCreateSeller = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);
      await contract.createSeller(sellerName, sellerBio, sellerAddress);
      console.log("Seller added:", { sellerName, sellerAddress, sellerBio });
      alert("Seller added successfully");
      setSellerName("");
      setSellerAddress("");
      setSellerBio("");
    } catch (error) {
      console.error(error?.message);
      alert("Error while adding product: " + error?.message);
    }
  };

  const handleGetAllSellers = async () => {
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);
      const sellers = await contract.getAllSeller(signer);
      const formattedSellers = sellers.map((seller) => ({
        sellerID: seller.sellerID,
        sellerName: seller.name,
        sellerBio: seller.bio,
        sellerAddress: seller.sellerAddress,
        productsOwned: seller.productsOwned.toString(),
      }));
      // console.log(formattedProducts);
      setSellers(formattedSellers);
    } catch (error) {
      console.error(error?.message);
      alert("Error while adding product: " + error?.message);
    }
  };

  const handleRemoveSeller = async (e) => {
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);

      await contract.removeSellerByID(sellerId);
      console.log("Seller removed:", { sellerId });
      alert("Seller removed successfully");
      setSellerId("");
    } catch (error) {
      console.error(error?.message);
      alert("Error while removing seller: " + error?.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);
      await contract.createProduct(
        name,
        description,
        parseUnits(price,18) ,
        ownerAddress,
        ipfsCID
      );
      console.log("Product added:", {
        name,
        description,
        price,
        ownerAddress,
        ipfsCID,
      });

      alert("Product added successfully");
      // Clear the form
      setName("");
      setDescription("");
      setPrice(0);
      setOwnerAddress("");
      setIpfsCID("");
    } catch (error) {
      console.error(error?.message);
      alert("Error while adding product: " + error?.message);
    }
  };

  const handleUpdatePrice = async (e) => {
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);

      await contract.updatePrice(productId, parseUnits(price,18));
      console.log("Product price updated:", productId, price);
      alert("Product price updated successfully");
      setProductId("");
      setPrice(0);
    } catch (error) {
      console.error(error?.message);
      alert("Error while updating product price: " + error?.message);
    }
  };

  const handleRemoveProduct = async (e) => {
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);

      await contract.removeProductByID(productId);
      console.log("Product Deleted:", productId);
      alert("Product removed successfully");
      setProductId("");
    } catch (error) {
      console.error(error?.message);
      alert("Error while removing product: " + error?.message);
    }
  };

  window?.ethereum?.on("accountsChanged", (accounts) => {
    const account = accounts?.length > 0 ? accounts[0] : "";
    setAccount(account);
  });

  return (
    <section>
      <main>
        <h1 style={{ display: "flex", justifyContent: "space-between" }}>
          Welcome To the Admin Page{" "}
        </h1>
          <hr />
          <div className="product-grid">
            <h1>Product Section</h1>
            <form onSubmit={handleAddProduct}>
              <h2>Add Product</h2>
              <hr/>
              <section>
                <label>
                  Name:{" "}
                  <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  Description:{" "}
                  <input
                    name="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
              </section>
              <section>
                <label>
                  Price:{" "}
                  <input
                    name="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </label>
              </section>
              <section>
                <label>
                  IPFS CID:{" "}
                  <input
                    name="ipfsCid"
                    type="text"
                    value={ipfsCID}
                    onChange={(e) => setIpfsCID(e.target.value)}
                  />
                </label>
              </section>
              <section>
                <label>
                  Owner Address:{" "}
                  <input
                    name="ownerAddress"
                    type="text"
                    value={ownerAddress}
                    onChange={(e) => setOwnerAddress(e.target.value)}
                  />
                </label>
              </section>
              <button type="submit">Submit</button>
            </form>

            <form onSubmit={handleUpdatePrice}>
              <h2>Update Price</h2>
              <label>
                Product ID:{" "}
                <input
                  name="productID"
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </label>
              <label>
                New Price:{" "}
                <input
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </label>
              <button type="submit">Submit</button>
            </form>

            <form onSubmit={handleRemoveProduct}>
              <h2>Remove Product</h2>
              <section>
                <label>
                  Product ID:{" "}
                  <input
                    name="productID"
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </label>
                <button type="submit">Submit</button>
                <hr/>
              </section>
            </form>
          </div>
      
        <hr />

        <div className="seller-grid">
          <h1>Seller Section</h1>
          <form onSubmit={handleCreateSeller}>
        <h2>Add Seller</h2>
        <hr/>
          <section>
            <label>
              Name:{" "}
              <input
                name="name"
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </label>
            <label>
              Bio:{" "}
              <input
                name="bio"
                type="text"
                value={sellerBio}
                onChange={(e) => setSellerBio(e.target.value)}
              />
            </label>
            <label>
              Seller Address:{" "}
              <input
                name="sellerAddress"
                type="text"
                value={sellerAddress}
                onChange={(e) => setSellerAddress(e.target.value)}
              />
            </label>

            <button type="submit">Submit</button>
          </section>
        </form>
        <form onSubmit={handleRemoveSeller}>
        <h2>Remove Seller</h2>
          <section>
            <label>
              Seller ID:{" "}
              <input
                name="sellerID"
                type="text"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
              />
            </label>
            <button type="submit">Remove</button>
            <hr/>
          </section>
        </form>
        </div>
      
        
          <hr/>
          <br />
          
          <h2 style={{ display: "flex", justifyContent: "space-between" }}> List of sellers Added 
          <button onClick={handleGetAllSellers} className="button-50">Get All Sellers</button>
          </h2>
          <ul className='seller-profile-list'>
            {sellers.map((seller, index) => (
              <li key={index}>
                <Link to={`/sellerProfile/${seller.sellerID}`}>
                  Name: {seller.sellerName}, Seller Address: {seller.sellerAddress},
                  Product Owned: {seller.productsOwned}
                </Link>
              </li>
            ))}
          </ul>
      
      </main>
    </section>
  );
}

export default Admin;
