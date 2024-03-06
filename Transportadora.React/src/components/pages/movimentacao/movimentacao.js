import React, { useState, useRef, useEffect } from "react";
import SelectAutocomplete from "../../commons/autocomplete/autocomplete";
import { Box } from "@mui/material";
import {
  BuscarUltimaRota,
  CreateMovimentacao,
  GetEntregadoresPorUnidade,
  GetMovimentacao,
  GetNumeroRastreio,
  GetUnidades,
} from "../../../service/serviceMovimentacao";
import TextInput from "../../commons/text/text";
import Botao from "../../commons/button/button";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import Tabela from "../../commons/table/table";
import MsgBox from "../../../helpers/msgBox";
import { useAppState } from "../../../context/storeContextProvider";
import CustomSelect from "../../commons/select/select";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Movimentacao = () => {
  const [codRastreio, setCodRastreio] = useState("");
  const [unidade, setUnidade] = useState("");
  const [movimentacao, setMovimentacao] = useState([]);
  const [registro, setRegistro] = useState({});
  const [entregador, setEntregador] = useState("");
  const [entregadores, setEntregadores] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [numeroRastreio, setNumeroRastreio] = useState([]);
  const [erro, setErro] = useState(false);
  const [validated, setValidated] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState('')
  const form = useRef(null);
  const [mostrarEntregadores, setMostrarEntregadores] = useState(false);
  const [resultado, setResultado] = useState({});
  const { ...state } = useAppState();

  const optionsUnidades = [];
  unidades &&
    unidades?.map((item) => [
      optionsUnidades.push({ label: item.undescricao, id: item.uncodigo }),
    ]);

  const optionsNumeroRastreio = [];
  numeroRastreio &&
    numeroRastreio?.map((item) => [
      optionsNumeroRastreio.push({
        label: item.cecodigoRastreio,
        id: item.cecodigo,
      }),
    ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    //const form = event.currentTarget;
  };
  const handleChange = (value, event) => {
    if (event.target.localName == "li") {
      let index = event.target.id.indexOf("-");
      if (event.target.id.substring(0, index) == "CodUnidade") {
        registro["CodUnidade"] = value.id;
        GetEntregadoresPorUnidade(value.id).then((res) => {
          console.log('resss', res.data)
          setEntregadores(res.data);
        });
      }
      if (event.target.id.substring(0, index) == "Rastreio") {
        registro["Rastreio"] = value.label;
        BuscarUltimaRota(value.label, registro['CodUnidade']).then((res) => {
          console.log("ultima", res.data);
          if (res.data == true) {
            setMostrarEntregadores(true);
          }
        });
        BuscarMovimentacao(value.label);
      }
      if (event.target.id.substring(0, index) == "CodEntregador") {
        registro["CodEntregador"] = value.id;
      }
    } else {
      console.log("else");
      registro[event.target.id] = value;
    }
    setRegistro({ ...registro });
  };

  function CriarMovimentacao() {
    registro["TipoMovimentacao"] = tipoMovimentacao;
    registro["Rastreio"] = registro.Rastreio;
    setRegistro({ ...registro });
    console.log("registro", registro);
    CreateMovimentacao(registro).then((res) => {
      console.log("res", res.data);
      if (res.data.erro == true) {
        MsgBox.Show({ title: "Erro", type: "e", message: res.data.mensagem });
      } else {
        setResultado(res.data);
        BuscarMovimentacao();
        MsgBox.Show({
          title: "Sucesso",
          type: "s",
          message: "Dados salvos com sucesso!",
        });
      }
    });
  }

  const optionsEntregadores = [];
  entregadores &&
    entregadores?.map((item) => [
      optionsEntregadores.push({ label: item.etnome, id: item.etcodigo }),
    ]);

  const columns = [
    { nome: "Rastreio", tipoColuna: "texto" },
    { nome: "Unidade", tipoColuna: "texto" },
    { nome: "Tipo de Movimentação", tipoColuna: "texto" },
    { nome: "Entregador", tipoColuna: "texto" },
    { nome: "Observação", tipoColuna: "texto" },
  ];

  const dataSource =
    movimentacao &&
    movimentacao?.map((item) => [
      { name: item.rastreio },
      { name: item.unidade },
      { name: item.tipoMovimentacao },
      { name: item.entregador },
      { name: item.destinatarioAusente },
    ]);

  function BuscarMovimentacao(rastreio = "") {
    console.log(registro);
    if (registro.Rastreio != "") {
      GetMovimentacao(registro.Rastreio).then((res) => {
        setMovimentacao(res.data);
      });
    }
    if (rastreio != "") {
      GetMovimentacao(rastreio).then((res) => {
        setMovimentacao(res.data);
        res.data &&
          res.data?.map((item) => {
            if (item.ultimaEtapa == true) {
              setMostrarEntregadores(true);
            }
          });
      });
    }
  }

  useEffect(() => {
    GetUnidades()
      .then((res) => {
        setUnidades(res.data.data);
      })
      .finally(() => {
        registro["CodUnidade"] = state.unidade;
        setRegistro({ ...registro });
      });
    GetNumeroRastreio().then((res) => {
      console.log("numero", res.data);
      setNumeroRastreio(res.data.data);
    });
  }, []);
  useEffect(() => {
    console.log("reg", registro);
    GetEntregadoresPorUnidade(registro.CodUnidade).then((res) => {
      console.log('res', res.data)
      setEntregadores(res.data);
    });
  }, [registro['CodUnidade']]);
  useEffect(() => {
    if (resultado.ultimaEtapa == true) {
      setMostrarEntregadores(true);
    }
  }, [resultado]);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "30px",
            width: "70%",
          }}
        >
          <h4 style={{ textAlign: "left " }}>
            Entrada de Encomenda na unidade
          </h4>
          <hr />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Box
              component="form"
              ref={form}
              style={{ width: "100%" }}
              noValidate
              validated={validated}
              autoComplete="off"
              onSubmit={handleSubmit}
            >

          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="E" control={<Radio onChange={() => setTipoMovimentacao("E")} />} label="Entrada" />
              <FormControlLabel value="S" control={<Radio onChange={() => setTipoMovimentacao("S")} />} label="Saída" />
            </RadioGroup>
            </FormControl>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "10px",
                }}
              >
                <div className="row">
                  <div className="col-md">
                    <SelectAutocomplete
                      style={{ width: "100%" }}
                      id="Rastreio"
                      value={registro.Rastreio || ""}
                      label="N° Rastreio"
                      options={optionsNumeroRastreio}
                      onChange={handleChange}
                    ></SelectAutocomplete>
                    {/* <TextInput
                      style={{ width: "100%" }}
                      id="Rastreio"
                      value={registro.Rastreio || ""}
                      onChange={handleChange}
                      onBlur={BuscarMovimentacao}
                      label="N° Rastreio"
                    ></TextInput> */}
                  </div>
                  <div className="col-md-9">
                    <CustomSelect
                      style={{ width: "100%" }}
                      value={registro.CodUnidade || ""}
                      label="Unidade"
                      options={optionsUnidades}
                      onChange={handleChange}
                      id="CodUnidade"
                    ></CustomSelect>
                    {/* <SelectAutocomplete
                      style={{ width: "100%" }}
                      value={registro.CodUnidade || ""}
                      label="Unidade"
                      options={optionsUnidades}
                      onChange={handleChange}
                      id="CodUnidade"
                    ></SelectAutocomplete> */}
                  </div>
                </div>
                {mostrarEntregadores == true ? (
                  <SelectAutocomplete
                    style={{ width: "100%" }}
                    value={registro.CodEntregador || ""}
                    label="Entregador"
                    options={optionsEntregadores}
                    onChange={handleChange}
                    id="CodEntregador"
                  ></SelectAutocomplete>
                ) : (
                  ""
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "8px",
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
                    onClick={() => CriarMovimentacao()}
                    icon={<SaveIcon style={{ height: "15px" }}></SaveIcon>}
                  ></Botao>
                </div>
              </div>
            </Box>
            <div
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
      </div>
    </>
  );
};

export default Movimentacao;
