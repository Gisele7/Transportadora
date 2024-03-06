import React, { useState, useRef, useEffect } from 'react'
import { Box, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import MsgBox from "../../../helpers/msgBox";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../context/storeContextProvider";
import SelectAutocomplete from "../../commons/autocomplete/autocomplete";
import { GetNumeroRastreio, RegistrarEntrega } from '../../../service/serviceRegistroEntrega';
import TextInput from '../../commons/text/text';
import moment from 'moment';
import Botao from "../../commons/button/button";
import SaveIcon from '@mui/icons-material/Save';
import '../RegistroEntrega/RegistroEntrega.css';

const RegistroEntrega = () => {
  const navigate = useNavigate();
  const [erro, setErro] = useState(false)
  const [devolucao, setDevolucao] = useState(false)
  const [clienteNaoEncontrado, setClienteNaoEncontrado] = useState(false)
  const [validated, setValidated] = useState(false);
  const [registro, setRegistro] = useState({})
  const form = useRef(null)
  const [numeroRastreio, setNumeroRastreio] = useState([])
  const { ...state } = useAppState();


  const handleChange = (val, evt) => {
    if (evt.target.localName == "li") {
      let index = evt.target.id.indexOf("-");
      if (evt.target.id.substring(0, index) == "codTransporte") {
        console.log('val', val.id, evt.target)
        registro['codTransporte'] = val.id;
      }
    }
    if (evt.target.id == "devolucao") {
      if(val == true){
        setDevolucao(true);
        registro[evt.target.id] = evt.target.checked;
      }
      else{
        setDevolucao(false);
      }
    }
    if (evt.target.id == "destinatarioAusente") {
      if(val == true){
        setClienteNaoEncontrado(true);
        registro['observacoes'] = 'Será realizado uma nova tentativa de entrega.'
        registro[evt.target.id] = evt.target.checked;
      }
      else{
        setClienteNaoEncontrado(false);
      }
    }
    else {
      registro[evt.target.id] = val;
    }
    setRegistro({ ...registro })
  }


  const optionsNumeroRastreio = []
  numeroRastreio && numeroRastreio?.map((item) => [
    optionsNumeroRastreio.push({ label: item.cecodigoRastreio, id: item.cecodigo })
  ])



  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    //const form = event.currentTarget;   
  }

  function FormataData(data) {
    if (data != undefined) {
      return moment(data).format("YYYY-MM-DD");
    }
    else {
      return ""
    }
  }

  const Salvar = () => {
    console.log('regi', registro)
    if (form.current.checkValidity() === true) {
      RegistrarEntrega(registro).then(res => {
        console.log('res', res.data)
        MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados salvos com sucesso!" })
      }).catch((err) =>   MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados salvos com sucesso!" }))
      setErro(false)
    }
    else {
      setErro(true)
    }
  }

  useEffect(() => {
    GetNumeroRastreio().then((res) => {
      setNumeroRastreio(res.data.data)
    })
  }, [])
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        <div className="registroEntrega" style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
          <h4 style={{ textAlign: 'left ' }}>Registro de Entrega</h4>
          <hr />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Box
              component="form"
              ref={form}
              style={{ width: '100%' }}
              noValidate validated={validated}
              autoComplete="off"
              onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                <div className='row'>
                  <div className="col-md">
                    <SelectAutocomplete
                      style={{ width: "100%" }}
                      id="codTransporte"
                      value={registro.codTransporte || ""}
                      label="N° Rastreio"
                      options={optionsNumeroRastreio}
                      onChange={handleChange}
                    ></SelectAutocomplete>
                  </div>

                  <div className="col-md">
                    <TextInput style={{ width: '100%' }} type='datetime-local' value={registro.data || ""} size="small" id="data" label='Data' variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                </div>
                <div className='row'>
                  <div className="col-md-2">
                    <FormGroup>
                      <FormControlLabel control={<Checkbox value={registro.devolucao} onChange={(e) => handleChange(e.target.checked, e)} id='devolucao' />} label="Devolução" />
                    </FormGroup>
                  </div>
                  <div className="col-md-4">
                    <FormGroup>
                      <FormControlLabel control={<Checkbox value={registro.clienteNaoEncontrado} onChange={(e) => handleChange(e.target.checked, e)} id='destinatarioAusente' />} label="Destinatário ausente" />
                    </FormGroup>
                  </div>
                </div>
                {devolucao == true ?
                  <div className='row'>
                    <div className="col-md">
                      <TextInput className="motivoDevolucao" style={{ width: '100%', height: '25vh' }} value={registro.motivo || ""} size="small" id="motivo" label='Motivo' variant="outlined" onChange={handleChange} mostraErro={erro} />
                    </div>
                  </div>
                  : ""}
                <div className='row'>
                  <div className="col-md">
                    <TextInput className="descricaoRegistroEntrega" style={{ width: '100%', height: '25vh' }} value={registro.observacoes || ""} size="small" id="observacoes" label='Observações' variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                </div>

              </div>
            </Box>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }} className="btnSalvar">
            <Botao style={{ height: '4vh', width: '7vw' }} className="text-center" size="medium" variant="contained" color="success" type="button" text="Salvar" key={`btnSalvar`} onClick={() => Salvar()} icon={<SaveIcon style={{ height: '15px' }}></SaveIcon>}>
            </Botao>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegistroEntrega;