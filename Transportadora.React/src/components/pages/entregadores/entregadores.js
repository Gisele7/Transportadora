import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, TextField } from "@mui/material";
import Botao from "../../commons/button/button";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tabela from "../../commons/table/table";
import {
  CreateEntregador,
  DeleteEntregador,
  EditEntregador,
  GetUnidades,
  ListarEntregadores,
} from "../../../service/serviceEntregador";
import TextInput from "../../commons/text/text";
import SelectAutocomplete from "../../commons/autocomplete/autocomplete";
import MsgBox from "../../../helpers/msgBox";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../context/storeContextProvider";

const Entregadores = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [unidade, setUnidade] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [dados, setDados] = useState([]);
  const [entregador, setEntregador] = useState({});
  const [alterarDados, setAlterarDados] = useState(false);
  const [recarregaTabela, setRecarregaTabela] = useState(false);
  const [erro, setErro] = useState(false);
  const [salvou, setSalvou] = useState(false);
  const [mostraAlerta, setMostraAlerta] = useState(false);
  const [validated, setValidated] = useState(false);
  const form = useRef(null);
  const { ...state } = useAppState();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    //const form = event.currentTarget;
  };

  // function MostrarMensagem() {
  //   return (
  //     <Sweet
  //       mostrar={mostraAlerta}
  //       title="Sucesso"
  //       text="Dados salvos com sucesso!"
  //       type="s"
  //     ></Sweet>
  //   );
  // }

  function Salvar() {
    if (form.current.checkValidity() === true) {
      var entregadorAtual = {};
      if (alterarDados) {
        entregadorAtual = {
          Etnome: nome,
          Ettelefone: telefone,
          Etcodigo: entregador.etcodigo,
          EtcodUnidade: unidade,
        };
        EditEntregador(entregadorAtual).then((res) => {
          setAlterarDados(false);
          setNome("");
          setTelefone("");
          setEntregador(entregadorAtual);
          setSalvou(true);
          MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados alterados com sucesso!" })
        });
      } else {
        entregadorAtual = {
          Etnome: nome,
          Ettelefone: telefone,
          EtcodUnidade: unidade,
        };
        CreateEntregador(entregadorAtual).then((res) => {
          setAlterarDados(false);
          setNome("");
          setTelefone("");
          setEntregador(entregadorAtual);
          setSalvou(true);
          MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados salvos com sucesso!" })
        }).catch(error => {
         MsgBox.Show({title: 'Erro', type: 'e', message: 'Ocorreu um erro ao salvar os dados.'})
        });
      }
      setErro(false);
    } else {
      setErro(true);
    }
  }

  function ListarDados() {
    ListarEntregadores().then((res) => {
      setDados(res.data);
    });
    GetUnidades().then((res) => {
      setUnidades(res.data.data);
    });
  }

  const handleChange = (val, evt) => {
    if (evt.target.localName == "li") {
      let index = evt.target.id.indexOf("-");
      if (evt.target.id.substring(0, index) == "unidade") {
        console.log('val', val)
        setUnidade(val.id);
      }
    } else if (evt.target.id == "nome") {
      setNome(val);
    } else {
      setTelefone(val);
    }
    //registro[evt.target.id] = val
  };

  const CarregarEntregador = (entregador) => {
    setNome(entregador.etnome);
    setTelefone(entregador.ettelefone);
    setEntregador(entregador);
    setAlterarDados(true);
  };

  const ExcluirEntregador = (codEntregador) => {
    MsgBox.ConfirmExclude({message: 'Deseja realmente excluir o entregador?', type:'w', title: 'Exclusão', btnCancel: true, textConfirm: 'Sim, exlcuir'})
    .then(result => {
      if(result.isConfirmed){
        DeleteEntregador(codEntregador).then((res) => {
          setAlterarDados(false);
          setEntregador({});
        });
      }
    })
  };

  const optionsUnidades = [];
  unidades &&
    unidades?.map((item) => [
      optionsUnidades.push({ label: item.undescricao, id: item.uncodigo }),
    ]);

  //Colunas da tabela
  const columns = [
    { nome: "Nome", tipoColuna: "texto" },
    { nome: "Telefone", tipoColuna: "texto" },
    { nome: "Unidade", tipoColuna: "texto" },
    { nome: "Ações", tipoColuna: "botao" },
  ];

  //dados da tabela
  const dataSource =
    dados &&
    dados?.map((item) => [
      { name: item.etnome, corLinha: "" },
      { name: item.ettelefone, corLinha: "" },
      { name: item.etcodUnidade, corLinha: "" },
      {
        botoes: [
          {
            botao: (
              <Botao
                className="text-center"
                size="small"
                variant="contained"
                type="button"
                text="Alterar"
                style={{ marginRight: "5px" }}
                onClick={() => CarregarEntregador(item)}
                icon={<EditIcon style={{ height: "15px" }}></EditIcon>}
              ></Botao>
            ),
          },
          {
            botao: (
              <Botao
                className="text-center"
                size="small"
                variant="contained"
                color="error"
                type="button"setMostraAlerta
                text="Excluir"
                onClick={() => ExcluirEntregador(item.etcodigo)}
                icon={<DeleteIcon style={{ height: "15px" }} />}
              ></Botao>
            ),
          },
        ],
      },
    ]);

  useEffect(() => {
    console.log("alterar", alterarDados);
    ListarDados();
  }, [entregador]);
  useEffect(() => {
    ListarDados();
    if (state.usuario == undefined) {
      navigate("/")
  }
  }, []);
  useEffect(() => {
    setMostraAlerta(salvou);
  }, [salvou]);
  return (
    <>
      {/* {MostrarMensagem()} */}
      <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        <div className="entregadores" style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
          <h4>Entregadores</h4>
          <hr></hr>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "30ch" } }}
              ref={form}
              style={{ width: "100%" }}
              noValidate
              validated={validated}
              autoComplete="off"
            >
              <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px" }}>
                <h5>Dados do entregador</h5>
                <div className="row">
                  <div className="col-md-8">
                    <TextInput
                      style={{ width: "100%" }}
                      value={nome || ""}
                      size="small"
                      id="nome"
                      label="Nome"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextInput
                      mask="(99) 99999-9999"
                      style={{ width: "100%" }}
                      value={telefone || ""}
                      size="small"
                      id="telefone"
                      label="Telefone"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md">
                    <SelectAutocomplete
                      style={{ width: "100%" }}
                      value={unidade || ""}
                      label="Unidade"
                      options={optionsUnidades}
                      onChange={handleChange}
                      id="unidade"
                      mostraErro={erro}
                    ></SelectAutocomplete>
                  </div>
                </div>

              </div>
            </Box>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2%",
            }}
            className="btnSalvar"
          >
            <Botao
              style={{ height: "4vh", width: "7vw" }}
              className="text-center"
              size="small"
              variant="contained"
              color="success"
              type="button"
              text="Salvar"
              key={`btnSalvar`}
              onClick={() => Salvar()}
              icon={<SaveIcon style={{ height: "15px" }}></SaveIcon>}
            ></Botao>
          </div>
          <div className="hideCelular" style={{ display: 'flex', justifyContent: 'center', marginTop: '45px' }}>
            <Tabela columns={columns} dados={dataSource}></Tabela>
          </div>
        </div>
      </div>
    </>
  );
};
export default Entregadores;
