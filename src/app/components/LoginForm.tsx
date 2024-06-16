"use client";
import { getCsrfToken, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

function LoginForm() {
  const [csrfToken, setCsrfToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null) as Array<any>;

  const setErrorIfEmpty = (field: string, message: string) => {
    if (!field) {
      setError(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null); // Clear error on submit

    setErrorIfEmpty(username, "Username is required");
    // Add password validation if needed

    if (error) {
      return; // Don't submit if there's an error
    }

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      csrfToken,
    }) as any;
    console.log(JSON.stringify(res))
    if (res.error) {
      setError(res.error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchToken();
  }, []);

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
          aria-label="Username"
        />
        <label className="form-label" htmlFor="username">Email address</label>
      </div>

      <div data-mdb-input-init className="form-outline mb-4">
        <input
          type="password"
          id="password"
          className="form-control"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        <label className="form-label" htmlFor="password">Password</label>
      </div>

      {error && <p className="text-bg-danger">{error}</p>}
      <div className="form-check d-flex justify-content-center mb-4">
        <input
          className="form-check-input me-2"
          type="checkbox"
          id="keepLogin"
          name="keepLogin"
        />
        <label className="form-check-label" htmlFor="keepLogin">Remember me</label>
      </div>

      <button type="submit" className="btn btn-primary btn-block mb-4">Login</button>
    </form>
  );
}

export default LoginForm;
