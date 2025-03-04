import React, { useEffect, useState } from "react";
import axios from "axios";

const Auth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/profile", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const login = () => {
    window.location.href = "http://localhost:5000/auth/google?prompt=select_account";
  };

  const logout = () => {
    axios.get("http://localhost:5000/logout", { withCredentials: true }).then(() => {
      setUser(null);
    });
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
        <button onClick={login}>Login with Google</button>
      )}
    </div>
  );
};

export default Auth;
