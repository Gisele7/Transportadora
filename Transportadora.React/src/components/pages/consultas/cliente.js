import React, { useEffect, useRef, useState } from "react";
import { GetClientes, PesquisarCliente } from "../../../service/serviceCliente";
import Tabela from "../../commons/table/table";
import TextInput from "../../commons/text/text";
import Botao from "../../commons/button/button";
import EditIcon from '@mui/icons-material/Edit';
import { useAppState } from "../../../context/storeContextProvider";
import { useNavigate } from 'react-router-dom';
import MsgBox from '../../../helpers/msgBox';
import '../unidades/unidades.css'

const ConsultaCliente = () => {
  const [listaCliente, setListaCliente] = useState([]);
  const [consultou, setPesquisou] = useState(false);
  const [cliente, setCliente] = useState("");
  const [optionsCliente, setOptionsCliente] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const { ...state } = useAppState();

  const navigate = useNavigate();


  const handleChange = (val, evt) => {
    if (evt.target.id == 'nome') {
      setNome(val)
    }
    else if (evt.target.id == 'telefone') {
      setTelefone(val)

    }
    else {
      setCpf(val)

    }
  }
  async function ListarClientes() {
    await GetClientes().then((res) => {
      console.log("lista", res.data);
      setListaCliente(res.data.data);
      var lista = [];
      res.data.data.forEach((item) => {
        const option = {
          id: item.clcodigo,
          label: item.clnome,
        };
        lista.push(option);
      });
      setOptionsCliente(lista);
    });
  }

  function EditarCliente(codCliente) {
    state.setCodigoCliente(codCliente)
    navigate('/Cliente')
  }

  function Pesquisar() {
    if(nome == "" && telefone == "" && cpf == ""){
      MsgBox.Show({title: 'Erro', type:'e', message: "Os dados para pesquisa não podem ser vazios."})
    }
    PesquisarCliente(nome, telefone, cpf).then(res => {
      console.log('res', res.data.data)
      setListaCliente(res.data.data)
    })
  }

  const columns = [
    { nome: "Cliente", tipoColuna: "texto" },
    { nome: "TipoCliente", tipoColuna: "texto" },
    { nome: "E-mail", tipoColuna: "texto" },
    { nome: "Telefone", tipoColuna: "texto" },
    { nome: "Ação", tipoColuna: "botao" },
  ];
  useEffect(() => {
    if (listaCliente != []) {
      var dadosTabela =
        listaCliente &&
        listaCliente?.map((item) => [
          { name: item.nome },
          { name: item.tipoCliente },
          { name: item.email },
          { name: item.telefone },
          {
            botoes: [{
              botao: <Botao className="text-center" size="small" variant="contained" type="button" text="Alterar" style={{ marginRight: '5px' }} onClick={() => EditarCliente(item.codCliente)} icon={<EditIcon style={{ height: '15px' }}></EditIcon>}>
              </Botao>
            }
            ]
          }
        ]);
      setDataSource(dadosTabela);
    }
  }, [listaCliente]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        <div className="unidade" style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
          <h4  style={{ textAlign: 'left ' }}>Consulta de Clientes</h4>
          <hr />
          <div style={{ width: '100%', height: '100%', display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="row">
              <div className="col-md">
                <TextInput style={{ width: '100%' }} id='nome' label='Nome' value={nome || ""} onChange={handleChange} required={false} />
              </div>
              <div className="col-md">
                <TextInput style={{ width: '100%' }} id='telefone' label='Telefone' value={telefone || ""} onChange={handleChange} required={false} />
              </div>
              <div className="col-md">
                <TextInput style={{ width: '100%' }} id='cpf' label='CPF' value={cpf || ""} onChange={handleChange} required={false} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '18px' }}>
            <Botao style={{ height: '4vh', width: '7vw' }} className="text-center" size="small" variant="outlined" color="warning" type="button" text="Pesquisar" key={`btnPesquisar`} onClick={() => Pesquisar()}>
            </Botao>
          </div>
          <div style={{ display: 'column', justifyContent: 'center', marginTop: '30px' }}>
            <Tabela
              className="responsive"
              columns={columns}
              dados={dataSource}
              showPagination={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultaCliente;
