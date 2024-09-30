import React, {useState} from 'react';

const Login=()=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) =>{
        e.preventDefault();
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </form>
        </div>
    );
}