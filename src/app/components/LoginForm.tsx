"use client"
import { signIn } from "next-auth/react";
import LoginButton from "./LoginButton";
import { getCsrfToken } from "next-auth/react";
 
export default async function LoginForm() {
  
const token = await getCsrfToken();
  const handleSubmit = async (event:any) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: username, password }), // Adjust based on your API route's requirements
    });

    const data = await response.json();

    if (!data.error) {
      // Handle successful login (e.g., redirect to protected page)
      console.log("Login successful!");
      // You can also use `signIn` here (if appropriate)
    } else {
      // Handle login errors (display error message)
      console.error("Login failed:", data.error);
    }
  };

  return (
    <form method="post" action="http://localhost:3000/api/auth/callback/credentials">
      <input type="hidden" name="csrfToken" value={ token }></input>
      <div data-mdb-input-init className="form-outline mb-4">
        <input
          type="email"
          id="username"
          className="form-control"
          name="username"
        />
        <label className="form-label" htmlFor="username"> Email address </label>
      </div>

      <div data-mdb-input-init className="form-outline mb-4">
        <input
          type="password"
          id="password"
          className="form-control"
          name="password"
        />
        <label className="form-label" htmlFor="password"> Password </label>
      </div>

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
