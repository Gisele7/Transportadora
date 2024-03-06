import { Box, Card, CardContent, CardHeader, TextField } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { CreatePickUp, GetClientes, GetEntregadores, GetUnidades, SelecionaEndereco, SelecionaEnderecoUnidade } from "../../../service/servicePickUp";
import { GoogleMap, useLoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';
import Botao from "../../commons/button/button";
import SaveIcon from '@mui/icons-material/Save';
import CustomSelect from "../../commons/select/select";
import '../../../assets/App.css'
import TextInput from "../../commons/text/text";
import SelectAutocomplete from "../../commons/autocomplete/autocomplete";
import pin from '../../../assets/pin.png'
import MsgBox from "../../../helpers/msgBox";
import { useAppState } from '../../../context/storeContextProvider';
import { useNavigate } from "react-router-dom";

const PickUp = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState({});
  const [endereco, setEndereco] = useState({});
  const [enderecoUnidade, setEnderecoUnidade] = useState({});
  const [clientes, setClientes] = useState([]);
  const [entregadores, setEntregadores] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [distancia, setDistancia] = useState("");
  const [calcularDistancia, setCalcularDistancia] = useState(false);
  const [erro, setErro] = useState(false)
  const [validated, setValidated] = useState(false);
  const [mostraMapa, setMostraMapa] = useState(false);
  const { ...state } = useAppState();
  const librariesTeste = ["places"];
  const form = useRef(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: 'AIzaSyAKWzKda5nOctOrohuG3Rf_DOwNGd8BWNU',
    librariesTeste,
    
  });
  // const center = useMemo(() => ({ lat: endereco.enlatitude, lng: endereco.enLongitude }), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    //const form = event.currentTarget;   
  }

  const handleChange = (val, evt) => {
    console.log(val, evt)

    console.log('evt.target.id', evt.target.id)
    console.log('val', val.id)
    if (evt.target.localName == "li") {
      let index = evt.target.id.indexOf("-");
      if (evt.target.id.substring(0, index) == 'pccodCliente') {
        pickup['pccodCliente'] = val.id;
        setPickup({ ...pickup });
        SelecionaEndereco(val.id).then(res => {
          console.log('endereco', res.data)
          console.log('VAL', val.id)
          setEndereco(res.data.data)
          setCalcularDistancia(true)
          setMostraMapa(true)
        })
      }
      else if (evt.target.id.substring(0, index) == 'pccodUnidade') {
        pickup['pccodUnidade'] = val.id;
        setPickup({ ...pickup });
        SelecionaEnderecoUnidade(val.id).then(res => {
          console.log('endUnidade', res.data.data)
          setEnderecoUnidade(res.data.data)
        })
      }
      else if (evt.target.id.substring(0, index) == 'pccodEntregador') {
        pickup['pccodEntregador'] = val.id;
        setPickup({ ...pickup });
      }
    }
    else {
      pickup[evt.target.id] = val;
      setPickup({ ...pickup });

    }
  };

  // function initMap() {
  //   const latitudeCliente = endereco.enlatitude;
  //   const longitudeCliente = endereco.enLongitude;
  //   var image = new google.maps.MarkerImage('https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png');

  //   console.log('image', image.url);
  //   console.log('lgt', longitudeCliente);
  //   // The location of Uluru
  //   const uluru = { lat: parseFloat(latitudeCliente), lng: parseFloat(longitudeCliente) };
  //   // The map, centered at Uluru
  //   const map = new google.maps.Map(document.getElementById("map"), {
  //     zoom: 16,
  //     center: uluru,

  //   });
  //   // The marker, positioned at Uluru
  //   const marker = new google.maps.Marker({
  //     position: uluru,
  //     map: map,
  //     icon: {
  //       url: (require('../../../assets/pin.png')),
  //       scaledSize: new google.maps.Size(42, 62)
  //     }

  //   });
  // }

  function BuscarDistancia() {
    var latitudeCliente = endereco.enlatitude;
    var longitudeCliente = endereco.enLongitude;
    var latitudeFilial = enderecoUnidade.enlatitude;
    var longitudeFilial = enderecoUnidade.enLongitude;
    var urlApi = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=-22.460449,-44.480745&destinations=-22.97182,-44.578907&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E`;
    var origem = new google.maps.LatLng(latitudeCliente, longitudeCliente);// aqui ele cria a latitude e longitude do cliente
    var destino = new google.maps.LatLng(latitudeFilial, longitudeFilial);// aqui ele cria a latitude e longitude da unidade
    //aqui ele usa a priopria biblioteca do google pra fazer isso, que a gente definiu la no script src===
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(

      {
        origins: [origem],
        destinations: [destino],
        travelMode: 'DRIVING',
      }, callback);

    function callback(response, status) {
      var rows = response.rows
      // aqui ele te da a distancia entre os 2 pontos.
      setDistancia(rows[0].elements[0].distance.value);
      console.log('dis', rows[0].elements[0].distance.value)
    }
  }


  function Salvar() {
    if (form.current.checkValidity() === true) {
      pickup['pcdistancia'] = distancia;
      setPickup({ ...pickup });
      CreatePickUp(pickup).then((res) => {
        setPickup(res.data.data)
        MsgBox.Show({title: 'Sucesso', type:'s', message: "Dados salvos com sucesso!"})
      });
      setErro(false);
    }
    else {
      setErro(true);
    }

  }


  // google.maps.DistanceMatrixService(origem, destino, mode(res,status) => {
  //   console.log(res)
  // })

  const optionsCliente = []

  clientes && clientes?.map(cliente => [
    optionsCliente.unshift({ label: cliente.clnome, id: cliente.clcodigo })
  ])


  const optionsEntregador = []

  entregadores && entregadores?.map(entregador => [
    optionsEntregador.unshift({ label: entregador.etnome, id: entregador.etcodigo })
  ])

  const optionsUnidade = []

  unidades && unidades?.map(unidade => [
    optionsUnidade.unshift({ label: unidade.undescricao, id: unidade.uncodigo })
  ])

  useEffect(() => {
    GetClientes().then(res => {
      setClientes(res.data.data)
    })
    GetEntregadores().then(res => {
      setEntregadores(res.data.data)
    })

    GetUnidades().then(res => {
      setUnidades(res.data.data)
    })
  }, [])
  useEffect(() => {
    // initMap();
  }, [endereco])
  useEffect(() => {
    if (calcularDistancia == true) {
      BuscarDistancia();
    }
  }, [calcularDistancia])
  useEffect(() => {
    if (state.usuario == undefined) {
      navigate("/")
  }
  },[])


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
      <div className="pickup" style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
        <h4>PickUp</h4>
        <hr />
        <Box
          component="form"
          ref={form}
          style={{ width: '100%' }}
          noValidate validated={validated}
          autoComplete="off"
          onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h5>Pick-up</h5>
            <div className='row'>
              <div className="col-md-2">
                <TextInput
                  style={{ width: '100%' }}
                  value={pickup.pcdata || ""}
                  size="small"
                  id="pcdata"
                  type='date'
                  label="Data"
                  variant="outlined"
                  mostraErro={erro}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md">
                <SelectAutocomplete style={{ width: '100%' }} id='pccodUnidade' label='Unidade' value={pickup.pccodUnidade || ""} onChange={handleChange}
                  options={optionsUnidade} mostraErro={erro}>
                </SelectAutocomplete>
              </div>
              <div className="col-md">
                <SelectAutocomplete style={{ width: '100%' }} id='pccodEntregador' label='Entregador' value={pickup.pccodEntregador || ""} onChange={handleChange}
                  options={optionsEntregador} mostraErro={erro} >
                </SelectAutocomplete>
              </div>
              <div className="col-md-2">
                <TextInput
                InputProps={{
                  readOnly: true
                }}
                  style={{ width: '100%' }}
                  value={pickup.pcnumero || ""}
                  size="small"
                  id="pcnumero"
                  label="N° PickUp"
                  required={false}
                  variant="outlined"
                  mostraErro={erro}
                  onChange={(evt) => handleChange(evt.target.value, evt)}
                />
              </div>
            </div>

            <div className='row'>
              <div className="col-md">
                <TextInput
                  required={false}
                  style={{ width: '100%' }}
                  value={pickup.pcobservacao || ""}
                  size="small"
                  multiline
                  rows={5}
                  id="pcobservacao"
                  label="Observação"
                  variant="outlined"
                  mostraErro={erro}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </Box>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h5 style={{ marginTop: '20px' }}>Dados do Cliente</h5>
          <div className='row'>
            <div className="col-md">
              <SelectAutocomplete style={{ width: '100%' }} id='pccodCliente' label='Cliente' value={pickup.pccodCliente || ""} onChange={handleChange}
                options={optionsCliente} mostraErro={erro} >
              </SelectAutocomplete>
            </div>
          </div>
          <div className='row'>
            <div className="col-md">
              <TextInput
                required={false}
                style={{ width: '100%' }}
                value={endereco.encep || ""}
                size="small"
                label="CEP"
                variant="outlined"
                mostraErro={erro}
              />
            </div>
            <div className="col-md">
              <TextInput
                required={false}
                style={{ width: '100%' }}
                value={endereco.enlogradouro || ""}
                size="small"
                label="Logradouro"
                variant="outlined"
                mostraErro={erro}
              />
            </div>
          </div>
          <div className='row'>
            <div className="col-md">
              <TextInput
                required={false}
                style={{ width: '100%' }}
                value={endereco.encidade || ""}
                size="small"
                label="Cidade"
                variant="outlined"
                mostraErro={erro}
              />
            </div>
            <div className="col-md">
              <TextInput
                required={false}
                style={{ width: '100%' }}
                value={endereco.enbairro || ""}
                size="small"
                label="Bairro"
                variant="outlined"
                mostraErro={erro}
              />
            </div>
          </div>
          <div className='row'>
            <div className="col-md">
              <TextInput
                required={false}
                style={{ width: '100%' }}
                value={endereco.enestado || ""}
                size="small"
                label="Estado"
                variant="outlined"
                mostraErro={erro}
              />
            </div>

            <div className="col-md">
              <TextInput
                style={{ width: '100%' }}
                value={endereco.ennumero || ""}
                size="small"
                label="N°"
                variant="outlined"
                mostraErro={erro}
              />

            </div>
            <div className="col-md">
              <TextInput
              
                required={false}
                style={{ width: '100%' }}
                value={endereco.encomplemento || ""}
                size="small"
                label="Complemento"
                variant="outlined"
                mostraErro={erro}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }} className="btnSalvar">
            <Botao
              style={{ height: '4vh', width: '7vw' }}
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
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            {mostraMapa == true ?
              <div className="App">
                {!isLoaded ? (
                  <h1>Loading...</h1>
                ) : (
                  <GoogleMap
                    mapContainerClassName="map-container"
                    center={{ lat: endereco.enlatitude, lng: endereco.enLongitude }}
                    zoom={15}
                  >
                    <Marker position={{ lat: endereco.enlatitude, lng: endereco.enLongitude }}
                      icon={{
                        url: (require('../../../assets/pin.png')),
                        scaledSize: new google.maps.Size(42, 62)
                      }}
                    ></Marker>

                  </GoogleMap>
                )}
              </div> : ""}
            {/* <div id="map" style={{ height: '400px', width: '100%' }}></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickUp;
