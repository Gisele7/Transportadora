import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Box, CardHeader } from "@mui/material";
import { CreateCliente, EditCliente, SelecionaCliente } from "../../../service/serviceCliente";
import Botao from '../../commons/button/button';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios'
import TextInput from "../../commons/text/text";
import CustomSelect from "../../commons/select/select";
import moment from 'moment';
import MsgBox from "../../../helpers/msgBox";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../context/storeContextProvider";


const Cliente = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({});
  const [fisica, setFisica] = useState(false)
  const [erro, setErro] = useState(false)
  const [validated, setValidated] = useState(false);
  const [alterar, setAlterar] = useState(false);
  const [salvou, setSalvou] = useState(false);
  const [mostraAlerta, setMostraAlerta] = useState(false);
  const form = useRef(null)
  const { ...state } = useAppState();

  const focus = useRef(null);

  const handleChange = (val, evt) => {
    if (evt.target.id == 'codTipoCliente') {
      if (val == 1) {
        setFisica(true);
      }
      else {
        setFisica(false);
      }
    }

    cliente[evt.target.id] = val;
    setCliente({ ...cliente })
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    //const form = event.currentTarget;   
  }

  function BuscarCliente() {
    if (state.codigoCliente > 0) {
      SelecionaCliente(state.codigoCliente).then(res => {
        setCliente(res.data.data)
        setAlterar(true)
        if (res.data.data.codTipoCliente == 1) {
          setFisica(true)
        }
      })
    }
  }

  // function MostrarMensagem() {
  //   return <Sweet mostrar={mostraAlerta} title="Sucesso" text="Dados salvos com sucesso!" type="s"></Sweet>
  // }

  function FormataData(data) {
    if (data != undefined) {
      return moment(data).format("YYYY-MM-DD");
    }
    else {
      return ""
    }
  }

  function Salvar() {
    if (form.current.checkValidity() === true) {
      if (alterar == true) {
        EditCliente(cliente).then(res => {
          setSalvou(true)
          MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados alterados com sucesso!" })
        })
      }
      else {
        CreateCliente(cliente).then(res => {
          setCliente({})
          setSalvou(true)
          MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados salvos com sucesso!" })
        })
      }
      setErro(false)
    }
    else {
      setErro(true)
    }
  }

  async function BuscarCEP(cep) {
    console.log('cep', cep);
    if (cep == "") {
      return "";
    }
    else {
      const result = await axios.get(`https://viacep.com.br/ws/${cep}/json/`).catch((err)=>{
        MsgBox.Show({title: 'Erro', type:'e', message: "Erro ao buscar o CEP."})
        cliente['cep'] = ''
    });
    if(result != undefined){
      cliente['bairro'] = result.data.bairro;
      cliente['complemento'] = result.data.complemento;
      cliente['cidade'] = result.data.localidade;
      cliente['logradouro'] = result.data.logradouro;
      cliente['estado'] = result.data.uf;
      document.getElementById("numero").focus()
    }
      setCliente({ ...cliente })
    }
  }

  const optionSexo = [
    { id: 'f', label: 'Feminino' },
    { id: 'm', label: 'Masculino' },
  ]

  const optionTipoCliente = [
    { id: 1, label: 'Física' },
    { id: 2, label: 'Jurídica' },
  ]

  useEffect(() => {
    BuscarCliente();
    if (state.usuario == undefined) {
      navigate("/")
    }
  }, [])
  useEffect(() => {
    setMostraAlerta(salvou)
  }, [salvou])

  return (
    <>
      {/* {MostrarMensagem()} */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        <div className="cliente" style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
          <h4 style={{ textAlign: 'left ' }}>Cliente</h4>
          <hr />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '30ch' }, }}
              noValidate validated={validated}
              onSubmit={handleSubmit}
              ref={form}
              style={{ width: '100%' }}
              autoComplete="off">
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                <h5>Dados Pessoais</h5>
                <div className='row'>
                  <div className="col-md-10">
                    <TextInput style={{ width: '100%' }} value={cliente.nome || ""} size="small" id="nome" label="Nome" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                  <div className="col-md-2">
                    <CustomSelect
                      style={{ width: '100%' }}
                      labelId="sexo"
                      id="sexo"
                      native={true}
                      value={cliente.sexo || ""}
                      label="sexo"
                      onChange={handleChange}
                      options={optionSexo}
                      mostraErro={erro}
                      InputLabelProps={{ shrink: cliente.sexo != "" ? true : false }}
                    >
                    </CustomSelect>
                  </div>
                </div>

                <div className='row'>
                  <div className="col-md-3">
                    <CustomSelect
                      style={{ width: '100%' }}
                      labelId="tipoCliente"
                      id="codTipoCliente"
                      native={true}
                      value={cliente.codTipoCliente || ""}
                      label="Tipo Cliente"
                      onChange={handleChange}
                      options={optionTipoCliente}
                      mostraErro={erro}>
                    </CustomSelect>
                  </div>
                  <div className="col-md-5">
                    {fisica ? <TextInput style={{ width: '100%' }} mask="999.999.999-99" value={cliente.cpf || ""} size="small" id="cpf" label="CPF" variant="outlined" onChange={handleChange} mostraErro={erro} />
                      : <TextInput style={{ width: '100%' }} mask="99.999.999/9999-99" value={cliente.cnpj || ""} size="small" id="cnpj" label="CNPJ" variant="outlined" onChange={handleChange} mostraErro={erro} />
                    }
                  </div>
                  <div className="col-md-4">
                    <TextInput style={{ width: '100%' }} value={cliente.rg || ""} size="small" id="rg" label="RG" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                </div>

                {/* <div className='row'>
                  <div className="col-md-6">
                    <TextInput style={{ width: '100%' }} value={cliente.nomeMae || ""} size="small" id="nomeMae" label="Nome Mãe" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                  <div className="col-md-6">
                    <TextInput style={{ width: '100%' }} required={false} value={cliente.nomePai || ""} size="small" id="nomePai" label="Nome Pai" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                </div> */}


                <div className='row'>
                  <div className="col-md-3">
                    <TextInput style={{ width: '100%' }} type='date' value={FormataData(cliente.dataNascimento) || ""} size="small" id="dataNascimento" label='Data de Nascimento' variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                  <div className="col-md-6">
                    <TextInput style={{ width: '100%' }} type='email' value={cliente.email || ""} size="small" id="email" label="Email" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                  <div className="col-md">
                    <TextInput style={{ width: '100%' }} mask="(99) 99999-9999" value={cliente.telefone || ""} size="small" id="telefone" label="Telefone" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                </div>
                <h5 style={{ marginTop: '20px' }}>Endereço</h5>
                <div className='row'>
                  <div className="col-md-3">
                    <TextInput style={{ width: '100%' }} mask="99999-999" onBlur={BuscarCEP} value={cliente.cep || ""} size="small" id="cep" label="CEP" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                  <div className="col-md">
                    <TextInput style={{ width: '100%' }} value={cliente.logradouro || ""} size="small" id="logradouro" label="Logradouro" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                </div>

                <div className='row'>
                  <div className="col-md">
                    <TextInput style={{ width: '100%' }} value={cliente.cidade || ""} size="small" id="cidade" label="Cidade" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                  <div className="col-md">
                    <TextInput style={{ width: '100%' }} value={cliente.bairro || ""} size="small" id="bairro" label="Bairro" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                </div>

                <div className='row'>
                  <div className="col-md">
                    <TextInput style={{ width: '100%' }} value={cliente.estado || ""} size="small" id="estado" label="Estado" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                  <div className="col-md">
                    <TextInput style={{ width: '100%' }} value={cliente.numero || ""} size="small" id="numero" label="Número" variant="outlined" onChange={handleChange} mostraErro={erro} />
                  </div>
                  <div className="col-md">
                    <TextInput required={false} style={{ width: '100%' }} value={cliente.complemento || ""} size="small" id="complemento" label="Complemento" variant="outlined" onChange={handleChange} mostraErro={erro} />

                  </div>
                </div>
              </div>

              {/* <TextInput type='date' value={cliente.dataCadastro || ""} size="small" id="dataCadastro" label="Data de Cadastro" variant="outlined" onChange={handleChange} mostraErro={erro} /> */}
            </Box>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }} className="btnSalvar">
            <Botao style={{ height: '4vh', width: '7vw' }} className="text-center" size="medium" variant="contained" color="success" type="button" text="Salvar" key={`btnSalvar`} onClick={() => Salvar()} icon={<SaveIcon style={{ height: '15px' }}></SaveIcon>}>
            </Botao>
          </div>
        </div >
      </div>
    </>
  );
};

export default Cliente;
