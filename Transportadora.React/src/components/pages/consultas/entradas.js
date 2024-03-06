import React, { useEffect, useState } from "react";
import {
  GetClientes,
  GetEntradas,
  GetUnidades,
  PesquisarEntrada,
} from "../../../service/serviceEntrada";
import Tabela from "../../commons/table/table";
import TextInput from "../../commons/text/text";
import Botao from "../../commons/button/button";
import EditIcon from "@mui/icons-material/Edit";
import SelectAutocomplete from "../../commons/autocomplete/autocomplete";
import { useAppState } from "../../../context/storeContextProvider";
import { useNavigate } from "react-router-dom";
import '../consultas/entradas.css'

const ConsultaEntrada = () => {
  const [listaEntradas, setListaEntradas] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [cliente, setCliente] = useState(0);
  const [listaCliente, setListaCliente] = useState([]);
  const [listaUnidade, setListaUnidade] = useState([]);
  const [unidade, setUnidade] = useState(0);
  const [loading, setLoading] = useState(false);
  const { ...state } = useAppState();

  const navigate = useNavigate();

  function ListarEntradas() {
    GetEntradas().then((res) => {
      setListaEntradas(res.data.data);
    });
  }

  const handleChange = (value, event) => {
    if (event.target.localName == "li") {
      let index = event.target.id.indexOf("-");
      if (event.target.id.substring(0, index) == "cliente") {
        setCliente(value.id);
      }
      if (event.target.id.substring(0, index) == "unidade") {
        setUnidade(value.id);
      }
    }
  };

  const columns = [
    { nome: "N° Entrada", tipoColuna: "texto" },
    { nome: "N° Nota Fiscal", tipoColuna: "texto" },
    { nome: "Valor", tipoColuna: "texto" },
    { nome: "Cliente", tipoColuna: "texto" },
    { nome: "Unidade", tipoColuna: "texto" },
    { nome: "Ação", tipoColuna: "botao" },
  ];

  function EditarEntrada(codEntrada) {
    state.setCodigoEntrada(codEntrada);
    navigate("/Entrada");
  }
  const optionsClientes = [];
  listaCliente &&
    listaCliente?.map((item) => [
      optionsClientes.push({
        id: item.clcodigo.toString(),
        label: item.clnome,
      }),
    ]);

  const optionsUnidades = [];
  listaUnidade &&
    listaUnidade?.map((item) => [
      optionsUnidades.push({ label: item.undescricao, id: item.uncodigo }),
    ]);

  function Pesquisar() {
    PesquisarEntrada(cliente, unidade).then((res) => {
      console.log("res", res.data.data);
      setListaEntradas(res.data.data);
      setCliente(0);
      setUnidade(0);
    });
  }

  useEffect(() => {
    ListarEntradas();
    console.log('listaEntradas', dataSource)
    GetClientes().then(
      (res) => {
        setListaCliente(res.data.data);
      },
      GetUnidades().then((res) => {
        setListaUnidade(res.data.data);
      })
    );
  }, []);
  useEffect(() => {
    console.log('aaaa', dataSource)
    if (listaEntradas != []) {
      var dadosTabela =
        listaEntradas &&
        listaEntradas?.map((item) => [
          { name: item.numero },
          { name: item.numeroNotaFiscal },
          { name: item.valor },
          { name: item.cliente },
          { name: item.unidade },
          {
            botoes: [
              {
                botao: (
                  <Botao
                    key={`btn${item.numero}`}
                    className="text-center"
                    size="small"
                    variant="contained"
                    type="button"
                    text="Alterar"
                    style={{ marginRight: "5px" }}
                    onClick={() => EditarEntrada(item.codigoEntrada)}
                    icon={<EditIcon style={{ height: "15px" }}></EditIcon>}
                  ></Botao>
                ),
              },
            ],
          },
        ]);
      setDataSource(dadosTabela);
    }

    if (listaEntradas.length > 0) {
        setLoading(false)
      }
      else {
        setLoading(true)
      }
  }, [listaEntradas]);

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
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "30px",
            width: "70%",
          }}
        >
          <h4 style={{ textAlign: "left " }}>Consulta de Entradas</h4>
          <hr />
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <div className="col-md">
              <SelectAutocomplete
                required={false}
                style={{ width: "100%" }}
                value={cliente || ""}
                label="Cliente"
                options={optionsClientes}
                onChange={handleChange}
                id="cliente"
              ></SelectAutocomplete>
            </div>
            <div className="col-md">
              <SelectAutocomplete
                required={false}
                style={{ width: "100%" }}
                value={unidade || ""}
                label="Unidade"
                options={optionsUnidades}
                onChange={handleChange}
                id="unidade"
              ></SelectAutocomplete>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "18px",
            }}
          >
            <Botao
              style={{ height: "4vh", width: "7vw" }}
              className="text-center"
              size="small"
              variant="outlined"
              color="warning"
              type="button"
              text="Pesquisar"
              key={`btnPesquisar`}
              onClick={() => Pesquisar()}
            ></Botao>
          </div>
          <br/>
          {loading ? (
            <span class="loader" style={{alignSelf: 'center'}}></span>
          ) : (
            <div
              style={{
                display: "column",
                justifyContent: "center",
                marginTop: "30px",
              }}
            >
              <Tabela
                key={cliente}
                className="responsive"
                columns={columns}
                dados={dataSource}
                showPagination={true}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultaEntrada;
