import React, {useState} from "react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import "../sobre/sobre.css";
const Sobre = () => {

    const [mostrarTextoMissao, setMostrarTextoMissao] = useState(false);
    const [mostrarTextoVisao, setMostrarTextoVisao] = useState(false);
    const [mostrarTextoValores, setMostrarTextoValores] = useState(false);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className="sobreNos"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "30px",
            width: "100%",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Sobre nós</h1>
          <hr />
          <div style={{ display: "flex", flexDirection: "row" , justifyContent: 'space-between', gap: '10px'}}>
         <button type="button" className="btn btn-warning btnSobreMissao" style={{background: '#881ed94d', width: '30%'}} onMouseEnter={() => setMostrarTextoMissao(true)} onMouseLeave={() => setMostrarTextoMissao(false)}>Missão</button>
         <button type="button" className="btn btn-warning btnSobreVisao" style={{background: '#34ff014d', width: '30%'}} onMouseEnter={() => setMostrarTextoVisao(true)} onMouseLeave={() => setMostrarTextoVisao(false)}>Visão</button>
         <button type="button" className="btn btn-warning btnSobreValores" style={{background: '#0045f54d', width: '30%'}} onMouseEnter={() => setMostrarTextoValores(true)} onMouseLeave={() => setMostrarTextoValores(false)} >Valores</button>
          </div>
          <div style={{ display: "flex", flexDirection: "row" , justifyContent: 'center'}}>
          {mostrarTextoMissao && <span className="expansivel">Oferecer soluções logísticas confiáveis e inovadoras.</span>}
          {mostrarTextoVisao && <span className="expansivel">Facilitar o transporte de mercadorias de forma eficiente e segura.</span>}
          {mostrarTextoValores && <span className="expansivel">
            <ul>
                <li>Eficiência Operacional</li>
                <li>Integridade</li>
                <li>Inovação</li>
                <li>Sustentabilidade</li>
                <li>Foco no Cliente</li>
                <li>Desenvolvimento da equipe</li>
            </ul>
            </span>}
          </div>
          <br/>
          <h1 style={{ textAlign: "center" }}>Entre em contato conosco!</h1>
          <div style={{ display: "flex", flexDirection: "row" , justifyContent: 'center', gap: '10px'}} className="faleConosco">
          <a href="https://api.whatsapp.com/send?phone=+55999159535" target="_blank">
            <WhatsAppIcon/>
            </a>
            <a href="mailto:contato.bonavista@gmail.com">
            <EmailIcon />
            </a>
        </div>
        </div>
      </div>
    </>
  );
};

export default Sobre;
