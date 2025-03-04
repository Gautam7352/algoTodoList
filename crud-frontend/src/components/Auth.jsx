import React, { useEffect, useState } from "react";
import axios from "axios";
import Google from "./icons/Google"
const Auth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/profile", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        // Set a token or flag to indicate the user is logged in.
        localStorage.setItem("token", "loggedin");
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("token");
      });
  }, []);
  

  const login = () => {
    window.location.href = "http://localhost:5000/auth/google?prompt=select_account";
    localStorage.setItem("token", "loggedin");

  };

  const logout = () => {
    axios.get("http://localhost:5000/logout", { withCredentials: true }).then(() => {
      setUser(null);
    });
    localStorage.removeItem("token");

    window.location.reload()
  };

  return (
    <div className="auth-container">
      {user ? (
        <div className="user-auth">
          <h2>Welcome, {user.name.split(" ")[0]}</h2>
          <img src={user.avatar} alt="User Avatar" width="50" />
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login} className="loginbtn" >Login with <Google /></button>
      )}
    </div>
  );
};

export default Auth;
