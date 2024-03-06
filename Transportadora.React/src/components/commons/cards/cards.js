import React, { useEffect, useState } from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InfoIcon from '@mui/icons-material/Info';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import LoginIcon from '@mui/icons-material/Login';

const Cards = ({ tempo, index, handle, key }) => {
  const [time, setTime] = useState(false);

  const colors = [
    "linear-gradient(0deg, rgba(255, 255, 255, 1) 50%, rgba(255, 198, 0, 0.3) 100%)",
    "linear-gradient(0deg, rgba(255, 255, 255, 1) 50%, rgba(136, 30, 217, 0.3) 100%)",
    "linear-gradient(0deg, rgba(255, 255, 255, 1) 50%, rgba(30, 217, 174, 0.3) 100%)",
    "linear-gradient(0deg, rgba(255, 255, 255, 1) 50%, rgba(3, 99, 250, 0.3) 100%)",
  ];

  const colorsIcon = [
    "rgba(255, 200, 0, 1)",
    "rgba(136, 130, 217,1)",
    "rgba(30, 217, 174,1)",
    "rgba(3, 99, 250,1)",
  ];

  const text = ["Rastreie sua encomenda aqui!", "Leia sobre nós!", "Faça o login!", "aaa"];

  const icons = [
    <ShareLocationIcon style={{ marginRight: "10px" }} />,
    <InfoIcon style={{ marginRight: "10px" }} />,
    <LoginIcon style={{ marginRight: "10px" }} />,
    <LocalShippingIcon style={{ marginRight: "10px" }} />,
  ];

  const textIcon = [
    "Rastreio",
    "Sobre nós",
    "Login",
    "Teste2"
  ]

  const buttons = [
    <button className="btn btn-sm btn-default btnRastreio" onClick={handle}>
      Rastrear
    </button>,
    <button className="btn btn-sm btn-default btnRastreio" onClick={handle}>
      Ler mais
    </button>,
    <button className="btn btn-sm btn-default btnRastreio" onClick={handle}>
      Login
    </button>,
    <button
      className="btn btn-sm btn-default btnRastreio"
      onClick={handle}
    ></button>,
  ];

  useEffect(() => {
    setTimeout(() => setTime(true), tempo);
  });
  return (
    <>
      {time == true ? (
        <div
          className="caixinhas sombra"
          style={{ background: colors[index] }}
          tempo={tempo}
          key={key}
        >
          <div className="icon_alert" style={{ background: colorsIcon[index] }} key={key}>
            {icons[index]} {textIcon[index]}
          </div>
          <div className="texto">{text[index]}</div>
          <div className="alinha_botao">
            <span className="btn btn-sm btn-default botao">
              {icons[index]}
            </span>
            <div class="btnCard">
            {buttons[index]}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Cards;
