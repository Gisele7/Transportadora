import React, { useState, useRef, useEffect } from "react";
import { Box, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {
  CreateEntrada,
  EditEntrada,
  GetCliente,
  GetClientes,
  GetEnderecoCliente,
  GetEnderecoUnidade,
  GetPickUp,
  GetUnidades,
  SelecionarEntrada,
} from "../../../service/serviceEntrada";
import SelectAutocomplete from "../../commons/autocomplete/autocomplete";
import TextInput from "../../commons/text/text.js";
import Tabela from "../../commons/table/table";
import Botao from "../../commons/button/button";
import { useAppState } from "../../../context/storeContextProvider";
import AddIcon from "@mui/icons-material/Add";
import MsgBox from "../../../helpers/msgBox";
import moment from "moment";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../commons/select/select";
import PrintIcon from "@mui/icons-material/Print";
import Barcode from "react-barcode";
import "../entrada/entrada.css";

const Entrada = () => {
  const [clientes, setClientes] = useState([]);
  const [entrada, setEntrada] = useState({});
  const [unidades, setUnidades] = useState([]);
  const [pickup, setPickUp] = useState([]);
  const [enderecoCliente, setEnderecoCliente] = useState({});
  const [cliente, setCliente] = useState({});
  const [enderecoRemetente, setEnderecoRemetente] = useState({});
  const [remetente, setRemetente] = useState({});
  const [enderecoUnidade, setEnderecoUnidade] = useState({});
  const [distancia, setDistancia] = useState("");
  const [entradaItem, setEntradaItem] = useState({});
  const [entradaItens, setEntradaItens] = useState([]);
  const [calcularDistancia, setCalcularDistancia] = useState(false);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [erro, setErro] = useState(false);
  const [valorTotalConvertido, setValorTotalConvertido] = useState(0);
  const [distanciaEmKM, setDistanciaEmKM] = useState(0);
  const [valorCustoKM, setValorCustoKM] = useState(0.4);
  const [valorCustoPeso, setCustoPeso] = useState(0.5);
  const [valorCustoVolume, setCustoVolume] = useState(0.5);
  const [erroItens, setErroItens] = useState(false);
  const [validated, setValidated] = useState(false);
  const [agendado, setAgendado] = useState(false);
  const [calculaUrgenciaFragileSeguro, setCalculaUrgenciaFragileSeguro] =
    useState(false);
  const [mostraMapa, setMostraMapa] = useState(false);
  const [calcularValorTotal, setCalcularValorTotal] = useState(true);
  const [salvou, setSalvou] = useState(false);
  const form = useRef(null);
  const { ...state } = useAppState();
  const navigate = useNavigate();
  const [directions, setDirections] = useState(null);
  const librariesTeste = ["places"];
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAKWzKda5nOctOrohuG3Rf_DOwNGd8BWNU",
    librariesTeste,
  });
  const [alterar, setAlterar] = useState(false);
  const [directionsReponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const admin = state.usuario.administrador;

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    //const form = event.currentTarget;
  };

  const Imprimir = () => {
    window.print();
  };

  const handleSalvar = () => {
    if (form.current.checkValidity() === true) {
      entrada.Itens = entradaItens;
      entrada["valorTotal"] = valorTotalConvertido;
      if (alterar == false) {
        CreateEntrada(entrada)
          .then((res) => {
            setEntrada(res.data.data);
            MsgBox.Show({
              title: "Sucesso",
              type: "s",
              message: "Dados salvos com sucesso!",
            });
            setCalculaUrgenciaFragileSeguro(true);
          })
          .catch((err) => MsgBox.Show({ message: err, title: err, type: "e" }));
      } else {
        EditEntrada(entrada)
          .then((res) => {
            setEntrada(res.data.data);
            MsgBox.Show({
              title: "Sucesso",
              type: "s",
              message: "Dados alterados com sucesso!",
            });
            setCalculaUrgenciaFragileSeguro(true);
          })
          .catch((err) => MsgBox.Show({ message: err, title: err, type: "e" }));
      }
      setErro(false);
      setSalvou(true);
    } else {
      setErro(true);
      setErroItens(true);
    }
  };

  const columns = [
    { nome: "Descrição", tipoColuna: "texto" },
    { nome: "Peso", tipoColuna: "texto" },
    { nome: "Comprimento", tipoColuna: "texto" },
    { nome: "Largura", tipoColuna: "texto" },
    { nome: "Altura", tipoColuna: "texto" },
    { nome: "Valor", tipoColuna: "texto" },
  ];


  const handleChange = (value, event) => {
    if (event.target.id == "agendado") {
      if(value == true){
        setAgendado(true);
      } else{
        setAgendado(false)
      }
      entrada[event.target.id] = event.target.checked;
    } else if (event.target.id == "urgente") {
      entrada[event.target.id] = event.target.checked;
    } else if (event.target.id == "fragil") {
      entrada[event.target.id] = event.target.checked;
    } else if (event.target.id == "seguro") {
      entrada[event.target.id] = event.target.checked;
    }
    if (event.target.id == "codUnidade") {
      GetEnderecoUnidade(value).then((res) => {
        setEnderecoUnidade(res.data.data);
        setCalcularDistancia(true);
      });
    } else if (event.target.id == "codCliente") {
      GetEnderecoCliente(value).then((res) => {
        setEnderecoCliente(res.data.data);
        setCalcularDistancia(true);
        setMostraMapa(true);
      });
    } else if (event.target.id == "codRemetente") {
      GetEnderecoCliente(value).then((res) => {
        setEnderecoRemetente(res.data.data);
      });
      GetCliente(value).then((res) => {
        setRemetente(res.data.data);
      });
    }
    entrada[event.target.id] = value;
    setEntrada({ ...entrada });
  };

  const handleChangeItens = (value, event) => {
    entradaItem[event.target.id] = value;
    setEntradaItem({ ...entradaItem });
  };

  function BuscarEntrada() {
    if (state.codigoEntrada > 0) {
      SelecionarEntrada(state.codigoEntrada).then((res) => {
        setSalvou(true);
        setEntrada(res.data.data);
        setEntradaItens(res.data.data.itens);
        setValorTotalConvertido(res.data.data.valorTotal);
        setAlterar(true);
        setCalcularValorTotal(false);
        GetEnderecoCliente(res.data.data.codCliente).then((res) => {
          setEnderecoCliente(res.data.data);
          setCalcularDistancia(true);
          setMostraMapa(true);
        });
        GetEnderecoUnidade(res.data.data.codUnidade).then((res) => {
          setEnderecoUnidade(res.data.data);
          setCalcularDistancia(true);
        });
        GetCliente(res.data.data.codRemetente).then((res) => {
          setRemetente(res.data.data);
        });
        GetEnderecoCliente(res.data.data.codRemetente).then((res) => {
          setEnderecoRemetente(res.data.data);
        });
      });
    }
  }

  function ValidarItens() {
    var descricao = entradaItem.Eidescricao;
    var peso = entradaItem.Eipeso;
    var valor = entradaItem.Eivalor;
    if (descricao == undefined || peso == undefined || valor == undefined) {
      setErroItens(true);
      return false;
    } else {
      setErroItens(false);
      return true;
    }
  }
  useEffect(() => {
    if (!calcularValorTotal) {
      if (entradaItens.length > 0) {
        var itensTabela = [];
        entradaItens &&
          entradaItens?.map((item) => {
            itensTabela.push([
              { name: item.Eidescricao || item.eidescricao, corLinha: " " },
              { name: item.Eipeso || item.eipeso, corLinha: " " },
              { name: item.Eicomprimento || item.eicomprimento, corLinha: " " },
              { name: item.Eilargura || item.eilargura, corLinha: " " },
              { name: item.Eialtura || item.eialtura, corLinha: " " },
              { name: item.Eivalor || item.eivalor, corLinha: "" },
            ]);
          });
        setDadosTabela(itensTabela);
      }
    }
  }, [entradaItens]);

  useEffect(() => {
    if (state.usuario == undefined) {
      navigate("/");
    }
    GetClientes().then((res) => {
      setClientes(res.data.data);
    });
    GetUnidades()
      .then((res) => {
        setUnidades(res.data.data);
      })
      .finally(() => {
        if (state.usuario != "") {
          // entrada["codUnidade"] = state.unidade;
          // setEntrada({ ...entrada });
        }
      })
      .finally(() => {
        if (state.usuario != undefined) {
          GetEnderecoUnidade(state.unidade).then((res) => {
            setEnderecoUnidade(res.data.data);
            setCalcularDistancia(true);
          });
        }
      });
    BuscarEntrada();
   
  }, []);

  useEffect(() => {
    if (calcularDistancia) {
      BuscarDistancia();
      calculateRoutes();
    }
  }, [enderecoCliente]);

  useEffect(() => {
    calculaValorTotal();
  }, [entradaItens]);

  // useEffect(() => {
  //   if (calcularDistancia) {
  //     BuscarDistancia();
  //   }
  // }, [calcularDistancia]);

  // useEffect(() => {
  // //   if (calcularValorTotal) {
  // //     calculaValorTotal();
  // //   }
  // // }, [calcularValorTotal]);

  const optionsClientes = [];
  clientes &&
    clientes?.map((item) => [
      optionsClientes.push({
        id: item.clcodigo,
        label: item.clnome,
      }),
    ]);

  const optionsRemetentes = [];
  clientes &&
    clientes?.map((item) => [
      optionsRemetentes.push({
        id: item.clcodigo,
        label: item.clnome,
      }),
    ]);

  const optionsUnidades = [];
  unidades &&
    unidades?.map((item) => [
      optionsUnidades.push({ label: item.undescricao, id: item.uncodigo }),
    ]);

  const optionsPickUp = [];
  pickup &&
    pickup?.map((item) => [
      optionsPickUp.push({ label: item.pcnumero, id: item.pccodigo }),
    ]);

  const AdicionarItemLista = () => {
    if (ValidarItens() == true) {
      setCalcularValorTotal(true);
      setEntradaItens((prevState) => [...prevState, entradaItem]);
      var itemTabela = [
        { name: entradaItem.Eidescricao, corLinha: "" },
        { name: entradaItem.Eipeso, corLinha: "" },
        { name: entradaItem.Eicomprimento, corLinha: "" },
        { name: entradaItem.Eilargura, corLinha: "" },
        { name: entradaItem.Eialtura, corLinha: "" },
        { name: entradaItem.Eivalor, corLinha: "" },
      ];
      setDadosTabela((prevState) => [...prevState, itemTabela]);
      setEntradaItem({});
      setErroItens(false);
      calculaValorTotal();
    }
  };

  const directionsCallback = (response) => {
    if (response !== null && response.status === "OK") {
      setDirections(response);
    } else {
      console.log("Erro ao buscar direções: ", response);
    }
  };

  async function calculateRoutes() {
    if (enderecoCliente == "" || enderecoUnidade == "") {
      return console.log("vazios");
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: {
        lat: enderecoUnidade.enlatitude,
        lng: enderecoUnidade.enLongitude,
      }, // Coordenadas de origem
      destination: {
        lat: enderecoCliente.enlatitude,
        lng: enderecoCliente.enLongitude,
      }, // Coordenadas do destino
      travelMode: google.maps.TravelMode.DRIVING, // Modo de transporte (DRIVING, WALKING, BICYCLING, TRANSIT)
      // AddIcon: (require('../../../assets/pin.png')),
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  const calculaValorTotal = () => {
    entradaItens &&
      entradaItens?.map((item) => {
        const taxaPorQuilo = 0.5; // R$ por quilo
        const taxaPorQuilometro = 0.4; // R$ por quilômetro
        const taxaPorVolume = 0.5; // R$ por unidade de volume
        const volume = item.Eicomprimento ||item.eicomprimento * item.Eilargura ||item.eilargura * item.Eialtura ||item.eialtura;

        const distanciaNew = distancia / 1000;
        //calcula os custos
        const custoKm = distanciaNew * taxaPorQuilometro;
        const custoPeso =
          parseFloat(item.Eipeso || item.eipeso) * parseFloat(taxaPorQuilo);
        const custoVolume = volume * taxaPorVolume;

        setDistanciaEmKM(distanciaNew);
        setValorCustoKM(custoKm);
        setCustoPeso(custoPeso);
        setCustoVolume(custoVolume);

        var valorTotal = custoKm + custoPeso + custoVolume;

        if (calculaUrgenciaFragileSeguro) {
          //Adiciono 15% do valor, caso seja frágil
          if (entrada.fragil) {
            valorTotal *= 1.15;
          }
          //se urgente, add 20%
          else if (entrada.urgente) {
            valorTotal *= 1.2;
          }
          //se aplicar seguro, add 10%
          else if (entrada.seguro) {
            valorTotal *= 1.1;
          }
        }
        //  $("#Valor").val(parseFloat(valor) + parseFloat(valorItem));
        var valorConvertido = valorTotalConvertido + valorTotal;
        setValorTotalConvertido(valorConvertido);
      });

    //DesabilitarCampos();
  };

  const NovaEntrada = () => {
    state.setCodigoEntrada(0)
    setEntrada({})
    setMostraMapa(false)
    setEntradaItens([])
    setDadosTabela([])
    setDistancia("")
    setValorTotalConvertido(0)
    setEnderecoCliente({})
    setEnderecoUnidade({})
    setSalvou(false)
  }

  const CalculaDatas = (data) => {
    var days = 5;
    var dataAtual = new Date();
    var data2 = new Date(data);
    const dataAtualFormatada = moment(dataAtual).format("DD/MM/YYYY");

    // To calculate the time difference of two dates
    var diferencaEmTempo = data2.getTime() - dataAtual.getTime();

    // To calculate the no. of days between two dates
    var diferencaEmDias = diferencaEmTempo / (1000 * 3600 * 24);

    if (diferencaEmDias <= 5) {
      entrada["DataAgendado"] = "";
      setEntrada({ ...entrada });
      MsgBox.Show({
        title: "Erro",
        type: "e",
        message: "A quantidade de dias deve ser igual ou superior a 5 dias.",
      });
    }
  };
  const BuscarDistancia = () => {
    var latitudeCliente = enderecoCliente.enlatitude;
    var longitudeCliente = enderecoCliente.enLongitude;
    var latitudeFilial = enderecoUnidade.enlatitude;
    var longitudeFilial = enderecoUnidade.enLongitude;
    var urlApi = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=-22.460449,-44.480745&destinations=-22.97182,-44.578907&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E`;
    var origem = new google.maps.LatLng(latitudeCliente, longitudeCliente); // aqui ele cria a latitude e longitude do cliente
    var destino = new google.maps.LatLng(latitudeFilial, longitudeFilial); // aqui ele cria a latitude e longitude da unidade
    //aqui ele usa a priopria biblioteca do google pra fazer isso, que a gente definiu la no script src===
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origem],
        destinations: [destino],
        travelMode: "DRIVING",
      },
      callback
    );

    function callback(response, status) {
      if (response != null) {
        var rows = response.rows;
        // aqui ele te da a distancia entre os 2 pontos.
        var distancia = rows[0].elements[0].distance.value;
        setDistancia(distancia);
        setCalcularValorTotal(true);
      }
    }
  };

  return (
    <>
      {state.codigoEntrada > 0 ? (
        <div className="col-md noPrint">
          <Botao
            style={{
              height: "4vh",
              width: "12vw",
            }}
            className="text-center"
            size="small"
            variant="contained"
            color="primary"
            type="button"
            text="Nova Entrada"
            key={`btnNewEntrada`}
            onClick={NovaEntrada}
            icon={<AddIcon style={{ height: "15px" }}></AddIcon>}
          ></Botao>
        </div>
      ) : (
        ""
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "30px",
            width: "70%",
          }}
          className="noPrint"
        >
          <h4 style={{ textAlign: "left " }}>Entrada</h4>

          <hr />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "95%",
              }}
            >
              <Box
                component="form"
                ref={form}
                style={{ width: "100%" }}
                noValidate
                validated={validated.toString()}
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
                  <h5>Dados da Entrada</h5>
                  <div className="row">
                    <div className="col-md-4">
                      <CustomSelect
                        key={entrada.codUnidade}
                        style={{ width: "100%" }}
                        value={entrada.codUnidade || ""}
                        label="Unidade"
                        options={optionsUnidades}
                        onChange={handleChange}
                        id="codUnidade"
                        mostraErro={erro}
                      ></CustomSelect>
                    </div>
                    <div className="col-md-4">
                      <CustomSelect
                        key={entrada.codCliente}
                        style={{ width: "100%" }}
                        value={entrada.codCliente || ""}
                        label="Cliente"
                        options={optionsClientes}
                        onChange={handleChange}
                        id="codCliente"
                        mostraErro={erro}
                      ></CustomSelect>
                    </div>
                    <div className="col-md-4">
                      <CustomSelect
                        key={entrada.codRemetente}
                        style={{ width: "100%" }}
                        value={entrada.codRemetente || ""}
                        label="Remetente"
                        options={optionsRemetentes}
                        onChange={handleChange}
                        id="codRemetente"
                        mostraErro={erro}
                      ></CustomSelect>
                    </div>
                    <div className="col-md">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={entrada.urgente || false}
                              onChange={(e) =>
                                handleChange(e.target.checked, e)
                              }
                              id="urgente"
                            />
                          }
                          label="Urgente"
                        />
                      </FormGroup>
                    </div>
                    <div className="col-md">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={entrada.fragil || false}
                              onChange={(e) =>
                                handleChange(e.target.checked, e)
                              }
                              id="fragil"
                            />
                          }
                          label="Frágil"
                        />
                      </FormGroup>
                    </div>
                    <div className="col-md">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={entrada.seguro || false}
                              onChange={(e) =>
                                handleChange(e.target.checked, e)
                              }
                              id="seguro"
                            />
                          }
                          label="Seguro"
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md">
                      <SelectAutocomplete
                        style={{ width: "100%" }}
                        value={entrada.codPickUp || ""}
                        label="PickUp"
                        options={optionsPickUp}
                        onChange={handleChange}
                        id="codPickUp"
                        required={false}
                        mostraErro={erro}
                      ></SelectAutocomplete>
                    </div>
                    <div className="col-md">
                      <TextInput
                      type="number"
                        style={{ width: "100%" }}
                        id="numeroNotaFiscal"
                        value={entrada.numeroNotaFiscal || ""}
                        onChange={handleChange}
                        label="N° Nota Fiscal"
                      ></TextInput>
                    </div>
                    <div className="col-md">
                      <TextInput
                        style={{ width: "100%" }}
                        required={false}
                        id="Numero"
                        value={entrada.numero || ""}
                        onChange={handleChange}
                        label="N° Entrada"
                      ></TextInput>
                    </div>
                    <div className="col-md">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={entrada.agendado || false}
                              onChange={(e) =>
                                handleChange(e.target.checked, e)
                              }
                              id="agendado"
                            />
                          }
                          label="Agendado"
                        />
                      </FormGroup>
                    </div>

                    {agendado == true ? (
                      <div className="col-md">
                        <TextInput
                          style={{ width: "100%" }}
                          required={agendado}
                          id="DataAgendado"
                          type="datetime-local"
                          value={entrada.DataAgendado || ""}
                          onChange={handleChange}
                          onBlur={CalculaDatas}
                          label=""
                        ></TextInput>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <hr />
                <h5 style={{ marginTop: "20px" }}>Destinatário</h5>
              </Box>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "10px",
                }}
              >
                <div className="row">
                  <div className="col-md-3">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      value={enderecoCliente.encep || ""}
                      size="small"
                      id="cep"
                      label="CEP"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                  <div className="col-md">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      value={enderecoCliente.enlogradouro || ""}
                      size="small"
                      id="logradouro"
                      label="Logradouro"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      value={enderecoCliente.encidade || ""}
                      size="small"
                      id="cidade"
                      label="Cidade"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                  <div className="col-md">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      value={enderecoCliente.enbairro || ""}
                      size="small"
                      id="bairro"
                      label="Bairro"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      value={enderecoCliente.enestado || ""}
                      size="small"
                      id="estado"
                      label="Estado"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                  <div className="col-md">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      value={enderecoCliente.ennumero || ""}
                      size="small"
                      id="numero"
                      label="Número"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                  <div className="col-md">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      value={enderecoCliente.encomplemento || ""}
                      size="small"
                      id="complemento"
                      label="Complemento"
                      variant="outlined"
                      onChange={handleChange}
                      mostraErro={erro}
                    />
                  </div>
                </div>
              </div>

              <hr />
              <h5 style={{ marginTop: "20px" }}>Itens da Entrada</h5>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10px" }}
                className="entrada"
              >
                <div className="row" style={{ width: "100%" }}>
                  <div className="col-md-8">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      id="Eidescricao"
                      value={entradaItem.Eidescricao || ""}
                      onChange={handleChangeItens}
                      label="Descrição"
                      mostraErro={erroItens}
                    ></TextInput>
                  </div>

                  <div className="col-md">
                    <TextInput
                      required={false}
                      style={{ width: "100%" }}
                      id="Eipeso"
                      value={entradaItem.Eipeso || ""}
                      onChange={handleChangeItens}
                      label="Peso"
                      mostraErro={erroItens}
                    ></TextInput>
                  </div>
                  <div className="col-md">
                    <TextInput
                      style={{ width: "100%" }}
                      required={false}
                      id="Eivalor"
                      value={entradaItem.Eivalor || ""}
                      onChange={handleChangeItens}
                      label="Valor"
                      mostraErro={erroItens}
                    ></TextInput>
                  </div>
                </div>
              </div>
              <div className="row" style={{ width: "100%" }}>
                <div className="col-md">
                  <TextInput
                    style={{ width: "100%" }}
                    required={false}
                    id="Eicomprimento"
                    value={entradaItem.Eicomprimento || ""}
                    onChange={handleChangeItens}
                    label="Comprimento"
                    mostraErro={erroItens}
                  ></TextInput>
                </div>
                <div className="col-md">
                  <TextInput
                    style={{ width: "100%" }}
                    required={false}
                    id="Eilargura"
                    value={entradaItem.Eilargura || ""}
                    onChange={handleChangeItens}
                    label="Largura"
                    mostraErro={erroItens}
                  ></TextInput>
                </div>
                <div className="col-md">
                  <TextInput
                    style={{ width: "100%" }}
                    required={false}
                    id="Eialtura"
                    value={entradaItem.Eialtura || ""}
                    onChange={handleChangeItens}
                    label="Altura"
                    mostraErro={erroItens}
                  ></TextInput>
                </div>
                <div className="col-md">
                  <Botao
                    style={{
                      height: "4vh",
                      width: "12vw",
                      backgroundColor: "rgb(85,85,85,0.2)",
                    }}
                    className="text-center"
                    size="small"
                    variant="contained"
                    color="inherit"
                    type="button"
                    text="Adicionar"
                    key={`btnAdicionar`}
                    onClick={AdicionarItemLista}
                    icon={<AddIcon style={{ height: "15px" }}></AddIcon>}
                  ></Botao>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "8px",
                  gap: "10px",
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
                  onClick={handleSalvar}
                  icon={<SaveIcon style={{ height: "15px" }}></SaveIcon>}
                ></Botao>
                {salvou == true ? (
                  <Botao
                    style={{ height: "4vh", width: "7vw" }}
                    className="text-center"
                    size="small"
                    variant="contained"
                    color="secondary"
                    type="button"
                    text="Imprimir"
                    key={`btnImprimir`}
                    onClick={Imprimir}
                    icon={<PrintIcon style={{ height: "15px" }}></PrintIcon>}
                  ></Botao>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  border: "1px dotted",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  padding: "15px",
                  marginLeft: "25px",
                }}
              >
                <div style={{ marginRight: "5px" }}>
                  <center>
                    <h5 style={{ fontWeight: "bold" }}>Custos</h5>
                  </center>
                  <label>Distância: {distancia}m</label>
                  <label>Valor KM (R$): {valorCustoKM.toFixed(2)}</label>
                  <label>Valor Peso (R$): {valorCustoPeso.toFixed(2)}</label>
                  <label>
                    Valor Volume (R$): {valorCustoVolume.toFixed(2)}
                  </label>
                  <hr />
                  <TextInput
                    id="valorTotal"
                    InputProps={{ readOnly: true }}
                    value={valorTotalConvertido.toFixed(2)}
                  ></TextInput>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <div>

          {dadosTabela.length > 0 ? (
            <Tabela dados={dadosTabela} columns={columns}></Tabela>
            ) : (
              ""
              )}
              </div>
          <hr />
          {mostraMapa == true ? (
            <div className="App" style={{ width: "100%" }}>
              {!isLoaded ? (
                <h1>Loading...</h1>
              ) : (
                <GoogleMap
                  mapContainerClassName="map-container"
                  center={{
                    lat: enderecoCliente.enlatitude,
                    lng: enderecoCliente.enLongitude,
                  }}
                  zoom={15}
                >
                  <Marker
                    position={{
                      lat: enderecoCliente.enlatitude,
                      lng: enderecoCliente.enLongitude,
                    }}
                    icon={{
                      url: require("../../../assets/pin.png"),
                      scaledSize: new google.maps.Size(42, 62),
                    }}
                  ></Marker>

                  <Marker
                    position={{
                      lat: enderecoUnidade.enlatitude,
                      lng: enderecoUnidade.enLongitude,
                    }}
                    icon={{
                      url: require("../../../assets/pin.png"),
                      scaledSize: new google.maps.Size(42, 62),
                    }}
                  ></Marker>

                  {directionsReponse && (
                    <DirectionsRenderer directions={directionsReponse} />
                  )}
                  {/* <DirectionsService options={optionDirection} callback={directionsCallback} /> */}
                </GoogleMap>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="yPrint" style={{ display: "none" }}>
        <div
          style={{
            display: "flex",
            height: "100%",
            border: "2px dashed black",
            padding: "5px 0 0 0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              width: "50%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <label className="destinatarioRemetente">DESTINATÁRIO</label>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                padding: "0 0 0 10px",
                width: "100%",
              }}
            >
              <label>Contato: {cliente.telefone}</label>
              <label>
                Endereço: {enderecoCliente.enlogradouro},{" "}
                {enderecoCliente.ennumero}
              </label>
              <label>
                {enderecoCliente.enbairro}, {enderecoCliente.encidade} -{" "}
                {enderecoCliente.encep}
              </label>
            </div>
          </div>
          <div className="linha-vertical"></div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              width: "50%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <label className="destinatarioRemetente">REMETENTE</label>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                padding: "0 0 0 10px",
                width: "100%",
              }}
            >
              <label>Contato: {remetente.telefone}</label>
              <label>
                Endereço: {enderecoRemetente.enlogradouro},{" "}
                {enderecoRemetente.ennumero}
              </label>
              <label>
                {enderecoRemetente.enbairro}, {enderecoRemetente.encidade} -{" "}
                {enderecoRemetente.encep}
              </label>
            </div>
          </div>
        </div>
        <div style={{ padding: "15px" }}>
          <Barcode
            value={entrada.numero || 0}
            width={3}
            height={75}
            font="Roboto"
            lineColor="#000000"
            background="transparent"
          />
        </div>
      </div>
    </>
  );
};

export default Entrada;
