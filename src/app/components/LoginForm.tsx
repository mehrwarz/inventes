"use client"
import { useState } from "react";
import Image from "next/image";
import logo from "../../../public/city-logo.png";
import LoginButton from "./LoginButton";

const pageStyle = `
    .background-radial-gradient {
        background-color: hsl(218, 41%, 15%);
        background-image: radial-gradient(650px circle at 0% 0%,
                #354f7e 15%,
                #2d446c 35%,
                #1e2d48 75%,
                #1d2b44 80%,
                transparent 100%),
            radial-gradient(1250px circle at 100% 100%,
                #4466a2 15%,
                #2d446c 35%,
                #1e2d48 75%,
                #1d2b44 80%,
                transparent 100%);
        min-height: 100vh;
    }
    
    #radius-shape-1 {
        height: 220px;
        width: 220px;
        top: -60px;
        left: -130px;
        background: radial-gradient(#44006b, #ad1fff);
        overflow: hidden;
    }
    
    #radius-shape-2 {
        border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
        bottom: -60px;
        right: -110px;
        width: 300px;
        height: 300px;
        background: radial-gradient(#44006b, #ad1fff);
        overflow: hidden;
    }
    
    .bg-glass {
        background-color: #fff8 !important;
        backdrop-filter: saturate(200%) blur(25px);
    }`;
    

const LoginForm = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  
  return (
    <div>
      <style>{pageStyle}</style>
      <section className="background-radial-gradient overflow-hidden p-lg-5">
        <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
          <div className="row gx-lg-5 align-items-center mb-5">
            <div
              className="col-lg-6 mb-5 mb-lg-0 text-center"
              style={{ zIndex: 10 }}
            >
              <Image
                src={logo}
                alt="City of Alexandria"
                className="img-fluid mb-4 mx-auto"
                style={{ width: 300, height: 300, maxWidth: "50vw" }}
              />
              <p
                className="h2 fw-bold ls-tight ms-0 ms-lg-5 opacity-75"
                style={{ color: "#e8effc" }}
              >
                invenTES
              </p>
              <span className="h3" style={{ color: "#8cb1f3" }}>
                Inventory Management System
              </span>
            </div>
            <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
              <div
                id="radius-shape-1"
                className="position-absolute rounded-circle shadow-5-strong"
              ></div>
              <div
                id="radius-shape-2"
                className="position-absolute shadow-5-strong"
              ></div>

              <div className="card bg-glass">
                <div className="card-body px-4 py-5 px-md-5">
                <form >
                    <div data-mdb-input-init className="form-outline mb-4">
                      <input
                        type="email"
                        id="username"
                        className="form-control"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <label className="form-label" htmlFor="username">
                        Email address
                      </label>
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
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>

                    <div className="form-check d-flex justify-content-center mb-4">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="keepLogin"
                        name="keepLogin"
                        onChange={(e) => setKeepLogin(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="keepLogin">
                        Remember me.
                      </label>
                    </div>
                    <LoginButton />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginForm;

