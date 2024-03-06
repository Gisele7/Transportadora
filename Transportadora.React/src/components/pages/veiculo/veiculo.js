import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import TextInput from "../../commons/text/text";
import { useAppState } from "../../../context/storeContextProvider";
import { useNavigate } from "react-router-dom";
import SelectAutocomplete from "../../commons/autocomplete/autocomplete";
import {
  CreateVeiculo,
  EditVeiculo,
  GetUnidades,
  GetVeiculos,
} from "../../../service/serviceVeiculo";
import Botao from "../../commons/button/button";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import MsgBox from "../../../helpers/msgBox";
import Tabela from "../../commons/table/table.js";

const Veiculo = () => {
  const [veiculo, setVeiculo] = useState({});
  const [validated, setValidated] = useState(false);
  const [erro, setErro] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const [alterar, setAlterar] = useState(false);
  const [salvou, setSalvou] = useState(false);
  const [unidade, setUnidade] = useState("");
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const { ...state } = useAppState();
  const form = useRef(null);
  const navigate = useNavigate();

  const handleChange = (val, evt) => {
    if (evt.target.localName == "li") {
      console.log("li", val, evt);
      let index = evt.target.id.indexOf("-");
      if (evt.target.id.substring(0, index) == "unidade") {
        console.log("val", val.id);
        setUnidade(val.id);
      }
    }

    veiculo[evt.target.id] = val;
    setVeiculo({ ...veiculo });
  };

  const handleSubmit = (event) => {
    //const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);
  };

  const ListarDados = () => {
    GetUnidades().then((res) => {
      console.log("unidade", res.data);
      setUnidades(res.data.data);
    });
    GetVeiculos().then((res) => {
      console.log("listarVeiculos", res.data);
      setListaVeiculos(res.data.data);
    });
  };

  const optionsUnidades = [];
  unidades &&
    unidades?.map((item) => [
      optionsUnidades.push({ label: item.undescricao, id: item.uncodigo }),
    ]);

  function Salvar() {
    if (form.current.checkValidity() === true) {
      var veiculoAtual = {};
      if (alterar == true) {
        EditVeiculo(veiculo).then((res) => {
          setSalvou(true);
          MsgBox.Show({
            title: "Sucesso",
            type: "s",
            message: "Dados alterados com sucesso!",
          });
        });
      } else {
        veiculoAtual = {
          descricao: veiculo.descricao,
          tipo: veiculo.tipo,
          placa: veiculo.placa,
          ano: veiculo.ano,
          corPredominante: veiculo.corPredominante,
          codUnidade: unidade,
        };
        console.log("veiculo", veiculoAtual);
        CreateVeiculo(veiculoAtual).then((res) => {
          console.log("veiculoAt", res);
          setVeiculo(veiculoAtual);
          console.log("veiculoo", veiculo);
          setSalvou(true);
          MsgBox.Show({
            title: "Sucesso",
            type: "s",
            message: "Dados salvos com sucesso!",
          });
        });
      }
      setErro(false);
    } else {
      setErro(true);
    }
  }

  function CarregaVeiculo(veiculo) {
    setVeiculo({ ...veiculo })
    setAlterar(true);
    setSalvou(false)
}


  const columns = [
    { nome: "Descrição", tipoColuna: "texto" },
    { nome: "Tipo", tipoColuna: "texto" },
    { nome: "Placa", tipoColuna: "texto" },
    { nome: "Ano", tipoColuna: "texto" },
    { nome: "Cor Predominante", tipoColuna: "texto" },
    { nome: "Unidade", tipoColuna: "texto" },
    { nome: "Ação", tipoColuna: "botao" },
  ];

  const dataSource =
    listaVeiculos &&
    listaVeiculos?.map((item) => [
      { name: item.descricao },
      { name: item.tipo },
      { name: item.placa },
      { name: item.ano },
      { name: item.corPredominante },
      { name: item.unidade },
      {
        botoes: [
          {
            botao: (
              <Botao
                className="text-center btnSize"
                size="small"
                variant="contained"
                type="button"
                key={`btn-${item.placa}`}
                text="Alterar"
                onClick={() => CarregaVeiculo(item)}
                icon={<EditIcon style={{ height: "15px" }}></EditIcon>}
              ></Botao>
            ),
          },
        ],
      },
    ]);

  useEffect(() => {
    ListarDados();
    if (state.usuario == undefined) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    ListarDados();
  }, [veiculo]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="unidade"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "30px",
          width: "70%",
        }}
      >
        <h4 style={{ textAlign: "left " }}>Veículo</h4>
        <hr />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Box
            component="form"
            ref={form}
            style={{ width: "100%" }}
            noValidate
            validated={validated}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: "10px",
              }}
            >
              <h5>Dados de Cadastro</h5>
              <div className="row">
                <div className="col-md">
                  <TextInput
                    style={{ width: "100%" }}
                    required
                    value={veiculo.descricao || ""}
                    size="small"
                    id="descricao"
                    label="Descrição"
                    variant="outlined"
                    onChange={handleChange}
                    mostraErro={erro}
                  />
                </div>
                <div className="col-md">
                  <TextInput
                    style={{ width: "100%" }}
                    required
                    value={veiculo.tipo || ""}
                    size="small"
                    id="tipo"
                    label="Tipo"
                    variant="outlined"
                    onChange={handleChange}
                    mostraErro={erro}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md">
                  <TextInput
                    style={{ width: "100%" }}
                    required
                    value={veiculo.placa || ""}
                    size="small"
                    id="placa"
                    label="Placa"
                    variant="outlined"
                    onChange={handleChange}
                    mostraErro={erro}
                  />
                </div>
                <div className="col-md">
                  <TextInput
                    style={{ width: "100%" }}
                    required
                    value={veiculo.ano || ""}
                    size="small"
                    id="ano"
                    label="Ano"
                    variant="outlined"
                    onChange={handleChange}
                    mostraErro={erro}
                  />
                </div>
                <div className="col-md">
                  <TextInput
                    style={{ width: "100%" }}
                    required
                    value={veiculo.corPredominante || ""}
                    size="small"
                    id="corPredominante"
                    label="Cor Predominante"
                    variant="outlined"
                    onChange={handleChange}
                    mostraErro={erro}
                  />
                </div>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2%",
                }}
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
            </div>
          </Box>
        </div>
        <div
          className="hideCelular"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "45px",
          }}
        >
          <Tabela columns={columns} dados={dataSource} />
        </div>
      </div>
    </div>
  );
};

export default Veiculo;
