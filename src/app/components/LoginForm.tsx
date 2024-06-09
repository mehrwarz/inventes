"use client"

import { getCsrfToken } from "next-auth/react";

export default async function LoginForm() {
  const token = await getCsrfToken();
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input type="hidden" name="csrfToken" value={token}></input>
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
