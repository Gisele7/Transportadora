import React, { useEffect, useState } from "react";
import { useAppState } from "../../../context/storeContextProvider";
import Cards from "../../commons/cards/cards";
import NavbarMain from "../../commons/navbar/navbarMain";
import ComponentModal from "../../commons/modal/modal";
import RastreioExterno from "../rastreio/rastreioExterno";
import Unidades from "../unidades/unidades";
import Sobre from "../sobre/sobre";
import "../paginaPrincipal/paginaPrincipal.css";
import Login from "../login/login";
import axios from 'axios'

const PaginaPrincipal = () => {
  const [open, setOpen] = useState(false);
  const [openSobre, setOpenSobre] = useState(false);
  const handleClose = () => setOpen(!open);
  const [dadosModal, setDadosModal] = useState();
  const rastreio = <RastreioExterno />;
  const sobre = <Sobre />
  const login = <Login />
  const { ...state } = useAppState();

  const handleRastreio = () => {
    setOpen(true);
    setDadosModal(rastreio);
  };

  const handleSobre = () => {
    setOpen(true);
    setDadosModal(sobre);
  };

  const handleLogin = () => {
    setOpen(true)
    setDadosModal(login)
  }

  let cards = [
    { tempo: 600, onclick: handleRastreio },
    { tempo: 1200, onclick: handleSobre },
    { tempo: 1800, onclick: handleLogin },
    // { tempo: 2400, onclick: handleRastreio },
  ];

  let modals = [
    { abrir: false, close: false },
    { abrir: false, close: false },
    { abrir: false, close: false },
    // { abrir: false, close: false },
  ];

  
  return (
    <>

      <div style={{ display: "flex", justifyContent: "center" }} className="paginaPrincipal">
        <div
          id="divConteudo"
          style={{
            padding: "5px 25px 5px 25px",
            marginTop: "5px",
            width: "50%",
          }}
        >
          <div className="row cards_dados">
            {cards.map((item, index) => (
              <Cards tempo={item.tempo} index={index} key={'caixa' + index} handle={item.onclick} />
            ))}
          </div>
        </div>
      </div>
      <div id="modal">
        <ComponentModal 
          abrir={open}
          close={handleClose}
          componente={dadosModal}
        />
      </div>
    </>
  );
};

export default PaginaPrincipal;
