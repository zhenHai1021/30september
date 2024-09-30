import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connectWallet, getContract } from "../util/contract";
import "./sellerProfile.css";

function SellerProfile() {
  const { sellerID } = useParams();
  const [seller, setSeller] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        if (!window.ethereum.isConnected()) {
          return alert("Please install MetaMask");
        }

        const { signer } = await connectWallet();
        const contract = getContract(signer);
        const seller = await contract.getSellerByID(sellerID);

        const formattedSeller = {
          sellerID: seller.sellerID,
          name: seller.name,
          bio: seller.bio,
          sellerAddress: seller.sellerAddress,
          productsOwned: seller.productsOwned.toString(),
        };
        setSeller(formattedSeller);
      } catch (error) {
        console.error(error?.message);
        alert("Error while getting seller: " + error?.message);
      }
    };

    const fetchComments = async () => {
      try {
        if (!window.ethereum.isConnected()) {
          return alert("Please install MetaMask");
        }

        const { signer } = await connectWallet();
        const contract = getContract(signer);
        const comments = await contract.getAllCommentsByID(sellerID); // Assuming there's a function like this in the contract
        setComments(comments);
      } catch (error) {
        console.error(error?.message);
        alert("Error while getting comments: " + error?.message);
      }
    };

    fetchSeller();
    fetchComments();
  }, [sellerID]);

  const addComment = async () => {
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }

      const { signer } = await connectWallet();
      const contract = getContract(signer);

      const timestamp = Date.now(); // This would be the timestamp you want to format
      const time = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(timestamp);
      await contract.createComment(newComment, time, sellerID);

      // Update the comments after adding a new one
      const updatedComments = await contract.getAllCommentsByID(sellerID);
      console.log(updatedComments);
      setComments(updatedComments);

      // Clear the comment input field
      setNewComment("");
    } catch (error) {
      console.error(error?.message);
      alert("Error while adding comment: " + error?.message);
    }
  };
  const handleListComments = async () => {
    try {
      if (!window.ethereum.isConnected()) {
        return alert("Please install MetaMask");
      }

      const { signer } = await connectWallet();
      const contract = getContract(signer);
      const comments = await contract.getAllCommentsByID(sellerID);
      setComments(comments);
    } catch (error) {
      console.error(error?.message);
      alert("Error while listing comments: " + error?.message);
    }
  };

  if (!seller) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <main>
        <h2>Seller Profile: {seller.sellerAddress}</h2>
        <p>Seller ID: {seller.sellerID}</p>
        <p>Name: {seller.name}</p>
        <p>Bio: {seller.bio}</p>
        <p>Number of Products Owned: {seller.productsOwned}</p>

        <hr />
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>
            Add comments:{" "}
            <textarea
              name="comments"
              value={newComment}
              placeholder="Write your comment here"
              onChange={(e) => setNewComment(e.target.value)}
              style={{ padding: 10 }} /* add padding to the textarea */
            />
          </label>
          <button
            className="button-28"
            onClick={addComment}
            style={{ width: 200, marginLeft: 10 }}
          >
            Add Comment
          </button>
         
        </div>
        <hr/>
        <div>
          <h2 style={{ display: "flex", justifyContent: "space-between" }}>Comments 
          <button className="button-51" onClick={handleListComments}>List Comments</button>
            </h2>  

          {comments.length > 0 ? (
            comments.map((comment, index) => <p key={index}>{comment}</p>)
          ) : (
            <p>No comments yet.</p>
          )}

         
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>{index+1}: {comment}</li>
            ))}
          </ul>
        </div>
      </main>
    </section>
  );
}

export default SellerProfile;
