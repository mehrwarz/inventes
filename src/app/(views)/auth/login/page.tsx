import LoginForm from '@/app/components/LoginForm'
import Image from "next/image";
import logo from "/src/public/city-logo.png";

const LoginPage = async () => {
  const pageStyle = `.background-radial-gradient {
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
    backdrop-filter: (200%) blur(25px);
}`;

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
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage