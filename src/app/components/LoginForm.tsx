"use client"
import { getCsrfToken } from "next-auth/react";
import { useState, useEffect } from "react";

function LoginForm() {
  const [csrfToken, setCsrfToken] = useState('');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent default form submission
    if (!username) {
      setError("Username is required");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false; // Don't submit if fields are empty
    }
    // add method and action to event.
    e.target.method = "post";
    e.target.action = "/api/auth/callback/credentials";
    // Submit the form
    e.target.submit();
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchToken();
  }, []); // Empty dependency array ensures fetching only once on mount

  return (
    <form onSubmit={handleSubmit} method="post">
      <div data-mdb-input-init className="form-outline mb-4">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input
          type="email"
          id="username"
          className="form-control"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="form-label" htmlFor="username"> Email address </label>
      </div>

      <div data-mdb-input-init className="form-outline mb-4">
        <input
          type="password"
          id="password"
          className="form-control"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="form-label" htmlFor="password"> Password </label>
      </div>

      {error && <p className="text-bg-danger">{error}</p>}

      <div className="form-check d-flex justify-content-center mb-4">
        <input
          className="form-check-input me-2"
          type="checkbox"
          id="keepLogin"
          name="keepLogin"
        />
        <label className="form-check-label" htmlFor="keepLogin"> Remember me. </label>
      </div>
      <button type="submit" className="btn btn-primary btn-block mb-4"> Login </button>
    </form>
  );
}

export default LoginForm;
