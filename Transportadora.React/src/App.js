import React, { useEffect } from "react";
import Cliente from "./components/pages/clientes/clientes";
import Entregadores from "./components/pages/entregadores/entregadores";
import Home from "./components/pages/home/home";
import PickUp from "./components/pages/pickup/pickup";
import Unidade from "./components/pages/unidades/unidades";
import ConsultaCliente from "./components/pages/consultas/cliente";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./assets/App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Entrada from "./components/pages/entrada/entrada";
import ConsultaEntrada from "./components/pages/consultas/entradas";
import Login from "./components/pages/login/login";
import Transporte from "./components/pages/transporte/transporte";
import Grupo from "./components/pages/grupo/grupo";
import Usuario from "./components/pages/usuario/usuario";
import Movimentacao from "./components/pages/movimentacao/movimentacao";
import logo from './assets/bonavista2_h_semfundo.png'
import '@fontsource/roboto';
import { useAppState } from "./context/storeContextProvider";
import Botao from "./components/commons/button/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Veiculo from "./components/pages/veiculo/veiculo";
import RegistroOcorrencia from "./components/pages/ocorrencia/ocorrencia";
import Rastreio from "./components/pages/rastreio/rastreio";
import RegistroEntrega from "./components/pages/RegistroEntrega/RegistroEntrega";
import Devolucao from "./components/pages/devolucao/devolucao";
import RastreioExterno from "./components/pages/rastreio/rastreioExterno";
import PaginaPrincipal from "./components/pages/paginaPrincipal/paginaPrincipal";

const App = () => {
  const location = useLocation()
  const { ...state } = useAppState();
  const navigate = useNavigate();

  const VerificaCookie = () => {
    if (document.cookie.length != 0) {
      var array = document.cookie.split("=");
      if (array[0] != ".TransportadoraCookie") {
        navigate('/Login')
      }
      else {
        navigate('/Home')

      }
    }
    else {
      navigate('/')
    }
  }

  function display() {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * 36000;
    var array = document.cookie.split("=");
    var cookie = array[0];
    document.cookie = cookie + "=" + state.usuario + ";" + now.toUTCString() + "; path=/";
    //console.log(document.cookie);  // 'Wed, 31 Oct 2012 08:50:17 UTC'
  }

  const handleEntrada = () => {
    state.setCodigoEntrada(0)
  }

  const Logout = () => {
    display();
    state.setUsuario(" ")
    navigate("/")
  }
  useEffect(() => {
    VerificaCookie();
  }, [])
  const CriarLink = (destino) => {
    return (
      <Link className='nav-link' to={destino}>{destino.replace("/", "")}</Link>
    )
  }
  return (
    <>
      <Navbar style={{ backgroundColor: "#555555" }} className="navbarReact">
        <Container className="navbar">
          <Navbar.Brand href="/Home"><img src={logo} title="Voltar para home" style={{ width: '160px' }} /></Navbar.Brand>
          {state.usuario != " "  ?
            <>
              <Nav className="me-auto">
                <NavDropdown title="Cadastros">
                  {/* <Link className="nav-link" to="/Unidade">Unidades</Link> */}
                  {CriarLink("/Unidade")}
                  <Link className="nav-link" to="/Cliente">Cliente</Link>
                  <Link className="nav-link" to="/Entregadores">Entregadores</Link>
                  <Link className="nav-link" to="/PickUp">Pick-Up</Link>
                  {/* <Link className="nav-link" to="/Grupo">Grupo</Link>
                  <Link className="nav-link" to="/Usuario">Usuário</Link>
                  <Link className="nav-link" to="/Veiculo">Veículo</Link> */}
                </NavDropdown>

                <NavDropdown title="Movimentação">
                  <Link className="nav-link" to="/Entrada">Entrada</Link>
                  <Link className="nav-link" to="/Transporte">Transporte</Link>
                  <Link className="nav-link" to="/Movimentacao">Entrada e Saída de encomenda na unidade</Link>
                  <Link className="nav-link" to="/RegistroOcorrencia">Registro de Ocorrência</Link>
                  {/* <Link className="nav-link" to="/Rastreio">Rastreio</Link> */}
                  <Link className="nav-link" to="/registroEntrega">Registro de Entrega</Link>
                </NavDropdown>

                <NavDropdown title="Consultas">
                  <Link className="nav-link" to="/ConsultaEntrada">Entrada</Link>
                  <NavDropdown.Divider />
                  <Link className="nav-link" to="/ConsultaCliente">Clientes</Link>
                </NavDropdown>

                {/* <NavDropdown title="Rastreio">
                  <Link className="nav-link" to="/RastreioExterno">RastreioExterno</Link>
                </NavDropdown> */}
                {/* <Link className="nav-link" to="/Login">Login</Link> */}
              </Nav>

              <div style={{ display: 'flex', position: 'relative', float: 'right', gap: '20px' }}>
                <span style={{ color: 'white', marginTop: '3px' }}>Olá, {state.usuario}! </span>
                <Botao
                  style={{ height: '4vh', width: '7vw' }}
                  className="text-center btnSair"
                  size="small"
                  variant="outlined"
                  color="inherit"
                  type="button"
                  text="Sair"
                  key={`btnSair`}
                  onClick={() => Logout()}
                ></Botao>
              </div>
            </>

            : ""}
        </Container>
      </Navbar>


      <>
        <div className="wrap-header-mobile" style={{ backgroundColor: "#555555" }}>
          <div className="logo-mobile">
            <img src={logo} alt="IMG-LOGO" ></img>
          </div>

          <div className="btn-show-menu-mobile hamburger hamburger--squeeze m-r--8">
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </div>
        </div>
        <div className="menu-mobile">
          <ul className="main-menu-m">
            <li>
              <a href="index.html">Início</a>
            </li>

            <li>
              <a href="#">Cadastros</a>
              <ul className="sub-menu-m">
                <li>
                  <Nav.Link href="/Unidade">Unidades</Nav.Link>
                  <Nav.Link href="/Cliente">Cliente</Nav.Link>
                  <Nav.Link href="/Entregadores">Entregadores</Nav.Link>
                  <Nav.Link href="/PickUp">Pick-Up</Nav.Link>
                  {/* <Nav.Link href="/Grupo">Grupo</Nav.Link>
                  <Nav.Link href="/Usuario">Usuário</Nav.Link> */}
                </li>
              </ul>

              <span className="arrow-main-menu-m">
                <i className="fa fa-angle-right" aria-hidden="true"></i>
              </span>
            </li>

            <li>
              <a href="#">Movimentação</a>
              <ul className="sub-menu-m">
                <li>
                  <Nav.Link href="/Entrada">Entrada</Nav.Link>
                  <Nav.Link href="/Transporte">Transporte</Nav.Link>
                  <Nav.Link href="/Movimentacao">Entrada e Saída de encomenda na unidade</Nav.Link>
                  <Nav.Link href="/RegistroOcorrencia">Registro de Ocorrência</Nav.Link>
                  {/* <Nav.Link href="/Rastreio">Rastreio</Nav.Link> */}
                  <Nav.Link href="/RegistroEntrega">Registro de Entrega</Nav.Link>
                </li>
              </ul>

              <span className="arrow-main-menu-m">
                <i className="fa fa-angle-right" aria-hidden="true"></i>
              </span>
            </li>

            <li>
              <a href="#">Consultas</a>
              <ul className="sub-menu-m">
                <li>
                  <Nav.Link href="/ConsultaEntrada">Entrada</Nav.Link>
                  <Nav.Link href="/ConsultaCliente">Clientes</Nav.Link>
                </li>
              </ul>

              <span className="arrow-main-menu-m">
                <i className="fa fa-angle-right" aria-hidden="true"></i>
              </span>
            </li>

            {/* <li>
              <a href="#">Rastreio</a>
              <ul className="sub-menu-m">
                <li>
                  <Nav.Link href="/RastreioExterno">Rastreio</Nav.Link>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </>
      <Routes>
        <Route index path="/" element={<PaginaPrincipal />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/Entregadores" element={<Entregadores />}></Route>
        <Route path="/Unidade" element={<Unidade />}></Route>
        <Route path="/Cliente" element={<Cliente />}></Route>
        <Route path="/Entrada" element={<Entrada />}></Route>
        <Route path="/PickUp" element={<PickUp />}></Route>
        <Route path="/Transporte" element={<Transporte />}></Route>
        <Route path="/ConsultaEntrada" element={<ConsultaEntrada />}></Route>
        <Route path="/ConsultaCliente" element={<ConsultaCliente />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/Grupo" element={<Grupo />}></Route>
        <Route path="/Usuario" element={<Usuario />}></Route>
        <Route path="/Movimentacao" element={<Movimentacao />}></Route>
        <Route path="/Veiculo" element={<Veiculo />}></Route>
        <Route path="/RegistroOcorrencia" element={<RegistroOcorrencia />}></Route>
        <Route path="/Rastreio" element={<Rastreio />}></Route>
        <Route path="/RegistroEntrega" element={<RegistroEntrega />}></Route>
        <Route path="/RastreioExterno" element={<RastreioExterno />}></Route>
      </Routes>
    </>
  );
};

export default App;
