"use client"

import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" href={"#"}>Navbar scroll</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll"
                    aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={ { "--bs-scroll-height": "100px;"} }>
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href={"#"}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={"#"}>Link</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" href={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Link
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" href={"#"}>Action</Link></li>
                                <li><Link className="dropdown-item" href={"#"}>Another action</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" href={"#"}>Something else here</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link disabled" aria-disabled="true" href={"#"}>Link</Link>
                        </li>
                    </ul>
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;