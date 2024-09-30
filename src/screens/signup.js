import React, { useState, useEffect } from "react";
//import { connectWallet, getContract } from "../util/contract";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

function Signup(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) =>{
        e.preventDefault();

  }

  return (
    <div>
        <h2>
            Sign Up
        </h2>
        <form onSubmit={handleSignUp}>
            <section>
                <label>Email: {""}
                <input
                    name='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label>Password: {""}
                <input
                    name='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <label>Confirm Password: {""}
                <input
                    name='confirmPassword'
                    type='password'
                    value={password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                
            </section>
            <section>
                <button type="submit">Sign Up</button>
            </section>
        </form>
    </div>
  );

}

export default Signup;