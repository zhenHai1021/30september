import React, { useState, useEffect } from "react";
import { connectWallet, getContract } from "../util/contract";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import "./homepage.css";
import { FaSearch } from "react-icons/fa";

const accountAtom = atomWithStorage("account", "");
const productAtom = atomWithStorage("product", []);

function Homepage() {
  const [account, setAccount] = useAtom(accountAtom);
  //const [productList, setProductList] = useAtom(productAtom);
  const [products, setProducts] = useAtom(productAtom);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const handleWalletConnection = async () => {
    try {
      const { account } = await connectWallet();
      setAccount(account);
    } catch (error) {
      console.error(error?.message);
    }
  };

  const handleGetAllProducts = async () => {
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }
      const { signer } = await connectWallet();
      const contract = getContract(signer);
      const products = await contract.getAllProduct(signer);
      const formattedProducts = products.map((product) => ({
        productID: product.productID,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        ownerAddress: product.ownerAddress,
        sold: product.sold,
        ipfsCID: product.ipfsCID, // Construct full IPFS URL
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error(error?.message);
      alert("Error while getting products: " + error?.message);
    }
  };

  /**
   * Handle search change event
   *
   * This function is triggered when the user types in the search input field.
   * It updates the search query state and applies the filters based on the
   * updated query and availability filter.
   *
   * @param {Object} e - The event object
   */
  //filter search
  const handleSearchChange = (e) => {
    // Convert the input value to lowercase
    const query = e.target.value.toLowerCase();

    // Update the search query state
    setSearchQuery(query);

    // Apply the filters based on the updated query and availability filter
    applyFilters(query, availabilityFilter);
  };

  /**
   * Handles the change event of the availability filter dropdown.
   *
   * @param {Object} e - The event object.
   * @return {void}
   */
  const handleAvailabilityChange = (e) => {
    // Get the selected filter from the dropdown.
    const filter = e.target.value;

    // Update the availability filter state.
    setAvailabilityFilter(filter);

    // Apply the filters based on the updated search query and availability filter.
    applyFilters(searchQuery, filter);
  };

  /**
   * Applies filters to the list of products based on the search query and availability filter.
   *
   * @param {string} query - The search query to filter by.
   * @param {string} availability - The availability filter to apply.
   * @return {void}
   */
  const applyFilters = (query, availability) => {
    // Filter the products based on the search query and availability filter.
    const filtered = products.filter((product) => {
      // Check if the product name or description includes the search query.
      const matchesQuery =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      // Check if the product matches the availability filter.
      const matchesAvailability =
        availability === "all" ||
        (availability === "sold" && product.sold) ||
        (availability === "available" && !product.sold);

      // Return true if the product matches both the query and availability filter.
      return matchesQuery && matchesAvailability;
    });

    // Update the filtered products state.
    setFilteredProducts(filtered);
  };

  /**
   * Sets the filtered products state to the initial list of products whenever
   * the list of products changes.
   *
   * @return {void}
   */
  useEffect(() => {
    // Sets the filtered products state to the initial list of products
    setFilteredProducts(products);
  }, [products]); // Runs whenever the products array changes

  window?.ethereum?.on("accountsChanged", (accounts) => {
    const account = accounts?.length > 0 ? accounts[0] : "";
    setAccount(account);
  });

  return (
    <section className="App">
      <main>
        <h1 style={{ display: "flex", justifyContent: "space-between" }}>
          Welcome To the Homepage{" "}
         
        </h1>

        <div>
          <hr />
          <div className="search-input-box">
            <FaSearch
              size={18}
              style={{ paddingBottom: 10, marginRight: 20, color: "black" }}
            />
            <input
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <div style={{ width: 10 }}></div>
            <select
              onChange={handleAvailabilityChange}
              value={availabilityFilter}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <br />
          <h2 style={{ display: "flex", justifyContent: "space-between" }}>
            List of products Added
            <button onClick={handleGetAllProducts} className="button-51">
              Get All Products
            </button>
          </h2>{" "}
          <ul className="product-grid">
            {filteredProducts.map((product, index) => (
              <li key={index} className="product-item">
                <Link to={`/product/${product.productID}`}>
                  {/* Create a link to the product detail page */}
                  <img
                    src={product.ipfsCID}
                    width={200}
                    height={200}
                    className="product-image"
                  />
                  <div className="product-info">
                    <div className="product-name">Name: {product.name}</div>
                    <div className="product-price">Price: {product.price/10**18} DGG</div>
                    <div className="product-status">
                      Status: {product.sold ? "SOLD" : "AVAILABLE"}
                    </div>
                  </div>
                  {/*<div>IPFSCID: {product.ipfsCID}</div>*/}
                </Link>
              </li>
            ))}
          </ul>
          <hr />
        </div>
      </main>
    </section>
  );
}

export default Homepage;
