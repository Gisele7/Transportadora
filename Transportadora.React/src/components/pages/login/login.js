import React, { useEffect, useState } from "react";
import Botao from "../../commons/button/button";
import { Card, CardContent, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { PostLogin } from "../../../service/serviceLogin";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../context/storeContextProvider";
import logo from '../../../assets/bonavista2_h_fundoclaro.png'
import MsgBox from "../../../helpers/msgBox";
import '../login/login.css'

const Login = () => {
  const [usuario, setUsuario] = useState({});
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const { ...state } = useAppState();
  const navigate = useNavigate();
  const handleChange = (val, evt) => {
    usuario[evt.target.id] = val;
    setUsuario({ ...usuario });
  };


  function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
   else var expires = "";
   document.cookie = name+"="+value+expires+"; path=/" ;
}

  function EfetuarLogin() {
    usuario['ussenha'] = md5(senha)
    usuario['usnome'] = user
    setUsuario({ ...usuario })
    PostLogin(usuario).then((res) => {
      if (res.data.status == "Ok") {
        console.log('login', res.data)
        state.setUsuario(res.data.data.usnome);
        state.setUnidade(res.data.data.uscodUnidade)
        var teste = res.data.data.usnome + '-' + res.data.data.uscodUnidade.toString()
        console.log('teste', teste)
        createCookie('.TransportadoraCookie', teste, 1)
        navigate("/Home");
      }
      else {
        MsgBox.Show({ title: 'Erro', type: 'e', message: "Usuário e/ou senha inválidos." })
      }
    });
  }

  useEffect(() => {
    console.log('usuario', state)
  }, [])
  return (
    <>
      <div className='divLogin'>
        <Card sx={{ width: "30%", height: "35%", display: "flex", backgroundColor: '#eeeeee', boxShadow: 'inset 0 0 5px #ccc', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="divLogoLogin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            <img src={logo} alt="logo" className='logoLogin' style={{ width: '25%' }} />
          </div>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '25px', alignItems: 'center', justifyContent: 'center', height: '75%' }}>
            <TextField InputLabelProps={{ shrink: usuario.usnome != "" ? true : false }} size="small" type="text" id="user" label="Usuário" variant="outlined" value={user || ""} onChange={(e) => setUser(e.target.value)} />
            <TextField InputLabelProps={{ shrink: usuario.ussenha != "" ? true : false }} size="small" type="password" id="senha" label="Senha" variant="outlined" value={senha || ""} onChange={(e) => setSenha(e.target.value)} />

            <Botao style={{ height: "4vh", width: '25%' }} className="text-center" size="small" variant="contained" color="primary" type="button" text="Login" onClick={() => EfetuarLogin()} key={`btnLogin`} icon={<LoginIcon style={{ height: "15px", marginLeft: '-8px' }}></LoginIcon>}
            ></Botao>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
