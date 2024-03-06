import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import logo from '../../../assets/bonavista2_h_semfundo.png'
import { Link } from "react-router-dom";

const NavbarMain = () => {
    return (
        <>
            <Navbar style={{ backgroundColor: "#555555" }} className="navbarReact">
                <Container className="navbar">
                    <Navbar.Brand href="/"><img src={logo} style={{ width: '160px' }} /></Navbar.Brand>
                </Container>
            </Navbar>


            {/* <div className="wrap-header-mobile" style={{ backgroundColor: "#555555" }}>
                <div className="logo-mobile">
                    <img src={logo} alt="IMG-LOGO" ></img>
                </div>

                <div className="btn-show-menu-mobile hamburger hamburger--squeeze m-r--8">
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                    </span>
                </div>
                <li>
                  
                </li>
            </div>

            <div className="menu-mobile">
                <ul className="main-menu-m">

                    <li>
                        <a href="/RastreioExterno">Rastreio</a>
                        <ul className="sub-menu-m">
                            <li>
                                <Nav.Link href="/RastreioExterno">Rastreio</Nav.Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <a href="/Login">Login</a>
                        <ul className="sub-menu-m">
                            <li>
                                <Nav.Link href="/Login">Login</Nav.Link>
                            </li>
                        </ul>
                    </li>
                    <Nav.Link href="/Login">Login</Nav.Link>

                </ul>
            </div> */}


        </>
    )
}

export default NavbarMain

