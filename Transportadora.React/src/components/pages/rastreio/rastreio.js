import React, { useEffect, useState } from "react";
import { useDeferredValue } from "react";
import {
  GetEntradasNaoIniciadas,
  GetMapa,
  GetRastreio,
} from "../../../service/serviceRastreio";
import Botao from "../../commons/button/button";
import TextInput from "../../commons/text/text";
import EditIcon from "@mui/icons-material/Edit";
import Tabela from "../../commons/table/table.js";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Modal } from "@mui/material";
import TimeLine from "../../commons/timeline/timeline";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import MapIcon from '@mui/icons-material/Map';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import InventoryIcon from '@mui/icons-material/Inventory';
import { GoogleMap, Marker, useJsApiLoader, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import '../rastreio/rastreio.css'

const Rastreio = () => {
  const [cpf, setCpf] = useState("");
  const deferredValue = useDeferredValue(cpf);
  const [listaEntradas, setListaEntradas] = useState([]);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [rastreio, setRastreio] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [openRastreio, setOpenRastreio] = useState(false);
  const [openMapa, setOpenMapa] = useState(false);
  const [mostraMapa, setMostraMapa] = useState(false);
  const [enderecos, setEnderecos] = useState({});
  const [distancia, setDistancia] = useState("");
  const handleOpenRastreio = () => setOpenRastreio(true);
  const handleCloseRastreio = () => setOpenRastreio(false);
  const handleOpenMapa = () => setOpenMapa(true);
  const handleCloseMapa = () => setMostraMapa(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: 'AIzaSyAKWzKda5nOctOrohuG3Rf_DOwNGd8BWNU',
    libraries: ["places"]

  });
  const [directionsReponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  const ListarEntradasNaoIniciadas = () => {
    GetEntradasNaoIniciadas().then((res) => {
      console.log("entradas", res.data);
      setListaEntradas(res.data);

      var dataSource =
        res.data &&
        res.data?.map((item) => [
          { name: item.numero },
          { name: item.cliente },
          { name: item.cpf },
          { name: item.valor },
          { name: item.unidade },
          { name: item.unidadeDestino },
          {
            botoes: [
              {
                botao: (
                  <Botao
                    className="text-center btnSize"
                    size="small"
                    id="btnRastrear"
                    variant="contained"
                    type="button"
                    key={`btn-${item.nome}`}
                    text="Rastrear"
                    onClick={() => CarregaRastreio(item.codigoEntrada)}
                    icon={<ShareLocationIcon style={{ height: "15px" }}></ShareLocationIcon>}
                  ></Botao>
                ),
              },

              {
                botao: (
                  <Botao
                    style={{ marginLeft: '10px' }}
                    className="text-center btnSize"
                    size="small"
                    color="success"
                    variant="contained"
                    type="button"
                    key={`btn-${item.nome}`}
                    text="Ver no mapa"
                    onClick={() => CarregaMapa(item.codigoEntrada)}
                    icon={<MapIcon style={{ height: "15px" }}></MapIcon>}
                  ></Botao>
                ),
              },
            ],
          },
        ]);
      setDadosTabela(dataSource);
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "#fff",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    zIndex: 0,
  };

  const columnsRastreio = [
    { nome: "Data", tipoColuna: "dataHora" },
    { nome: "Status", tipoColuna: "texto" },
    { nome: "Unidade", tipoColuna: "texto" },
    { nome: "Tipo de Movimentação", tipoColuna: "texto" },
    { nome: "Entregador", tipoColuna: "texto" },
    { nome: "Data de Entrega", tipoColuna: "data" },
  ];

  const dataSourceRastreio =
    rastreio &&
    rastreio?.map((item) => [
      { name: item.dataMovimentacao },
      { name: item.status },
      { name: item.unidade },
      { name: item.tipo },
      { name: item.entregador },
      { name: item.dataEntrega },
    ]);

  const CarregaRastreio = (codEntrada) => {
    GetRastreio(codEntrada).then((res) => {
      let dado = []
      res.data.data.map(item => {
        dado.push({
          dataMovimentacao: item.dataMovimentacao,
          unidade: item.unidade,
          tipo: item.tipo,
          icone: item.dataEntrega == null ? <LocalShippingIcon /> : <CloudDoneIcon />
        })
      })
      console.log("res", res.data.data);
      setRastreio(res.data.data);
      setTimeline(dado)
    });
    setOpenRastreio(true);
  };


  async function calculateRoutes() {
    if (enderecos == "") {
      return console.log('vazios')
    }
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: { lat: enderecos.latitude, lng: enderecos.longitude }, // Coordenadas de origem
      destination: { lat: enderecos.latitudeCliente, lng: enderecos.longitudeCliente }, // Coordenadas do destino
      travelMode: google.maps.TravelMode.DRIVING, // Modo de transporte (DRIVING, WALKING, BICYCLING, TRANSIT)
      // AddIcon: (require('../../../assets/pin.png')),

    })
    console.log('results', results)
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  const CarregaMapa = (codEntrada) => {
    GetMapa(codEntrada).then((res) => {
      setEnderecos(res.data.data)
      console.log("res", res.data);
      setOpenMapa(true)
      setMostraMapa(true)
    });
  };

  const handleChange = (val) => {
    const dados =
      listaEntradas && listaEntradas.filter((x) => x.cpf.includes(val));
    var dataSource =
      dados &&
      dados?.map((item) => [
        { name: item.numero },
        { name: item.cliente },
        { name: item.cpf },
        { name: item.valor },
        { name: item.unidade },
        { name: item.unidadeDestino },
        {
          botoes: [
            {
              botao: (
                <Botao
                  className="text-center btnSize"
                  size="small"
                  variant="contained"
                  type="button"
                  key={`btn-${item.nome}`}
                  text="Rastrear"
                  onClick={() => CarregaRastreio(item.codigoEntrada)}
                  icon={<ShareLocationIcon style={{ height: "15px" }}></ShareLocationIcon>}
                ></Botao>
              ),
            },
            {
              botao: (
                <Botao
                  style={{ marginLeft: '10px' }}
                  className="text-center btnSize"
                  size="small"
                  color="success"
                  variant="contained"
                  type="button"
                  key={`btn-${item.nome}`}
                  text="Ver no mapa"
                  onClick={() => CarregaMapa(item.codigoEntrada)}
                  icon={<MapIcon style={{ height: "15px" }}></MapIcon>}
                ></Botao>
              ),
            },
          ],
        },
      ]);
    setDadosTabela(dataSource);
    setCpf(val);
  };


  const BuscarDistancia = () => {
    var latitudeCliente = enderecos.latitudeCliente;
    var longitudeCliente = enderecos.longitudeCliente;
    var latitudeFilial = enderecos.latitude;
    var longitudeFilial = enderecos.longitude;
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
      var rows = response.rows;
      // aqui ele te da a distancia entre os 2 pontos.
      var distancia = rows[0].elements[0].distance.value;
      setDistancia(distancia);
    }
  }
  const columns = [
    { nome: "Número da Entrada", tipoColuna: "texto" },
    { nome: "Cliente", tipoColuna: "texto" },
    { nome: "CPF", tipoColuna: "texto" },
    { nome: "Valor", tipoColuna: "numero" },
    { nome: "Origem", tipoColuna: "texto" },
    { nome: "Destino", tipoColuna: "texto" },
    { nome: "Ações", tipoColuna: "botao" },
  ];

  useEffect(() => {
    ListarEntradasNaoIniciadas();
  }, []);
  useEffect(() => {
    if (mostraMapa == true) {
      BuscarDistancia();
      calculateRoutes();
      console.log("enderecos", enderecos);
    }
  }, [mostraMapa])

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
          className="rastreio"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "30px",
            width: "70%",
          }}
        >
          <h4 style={{ textAlign: "left " }}>Rastreio</h4>
          <hr />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextInput
              style={{ width: "100%" }}
              value={cpf || ""}
              size="small"
              id="cpf"
              label="CPF"
              variant="outlined"
              mask="999.999.999-99"
              onChange={handleChange}
            />
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

          <Modal
            sx={style}
            open={openRastreio}
            onClose={handleCloseRastreio}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <TimeLine events={timeline} key="timeLine" />
          </Modal>



          <div
            className="hideCelular"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "45px",
            }}
          >
            {/* {dadosTabela[0].length > 0 ? */}
            <Tabela columns={columns} dados={dadosTabela} />
            {/* : ""} */}
          </div>
        </div>

        {mostraMapa == true ?
          <div className="App" id="modal" style={{ width: '100%' }}>
            <label style={{ position: 'relative', float: 'right', cursor: 'pointer', color: 'black' }} onClick={handleCloseMapa}>X</label>
            {/* <Modal
              sx={style}
              open={openMapa}
              onClose={handleCloseMapa}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            > */}
            {!isLoaded ? (
              <h1>Loading...</h1>
            ) : (
              <GoogleMap
                mapContainerClassName="map-container"
                center={{ lat: enderecos.latitudeCliente, lng: enderecos.longitudeCliente }}
                zoom={15}
              >
                <Marker position={{ lat: enderecos.latitudeCliente, lng: enderecos.longitudeCliente }}
                  icon={{
                    url: (require('../../../assets/pin.png')),
                    scaledSize: new google.maps.Size(42, 62)
                  }}
                ></Marker>

                <Marker position={{ lat: enderecos.latitude, lng: enderecos.longitude }}
                  icon={{
                    url: (require('../../../assets/pin.png')),
                    scaledSize: new google.maps.Size(42, 62)
                  }}
                ></Marker>

                {directionsReponse && <DirectionsRenderer directions={directionsReponse} />}
                {/* <DirectionsService options={optionDirection} callback={directionsCallback} /> */}


              </GoogleMap>
            )}
            {/* </Modal> */}
          </div> : ""}

      </div>
    </>
  );
};

export default Rastreio;
