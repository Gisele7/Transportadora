import { Card, CardContent, CardHeader } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from "react-chartjs-2";
import Form from 'react-bootstrap/Form'
import Tabela from "../../commons/table/table";
import { Bar } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../context/storeContextProvider";
import { GetEntradasAgendadas, GetTransportesNaoIniciados, GetDevolvidos, GetEntradasIniciadas, GetUtilizacao, GetEntradasAnuais } from "../../../service/serviceHome";
import '../home/home.css'
import Loading from "../../commons/loading/loading";
import LoadingBar from "../../commons/loading/loadingBar";

const Home = () => {
  const [listaTranspNaoIniciados, setListaTranspNaoIniciados] = useState([])
  const [listaEntradasAgendadas, setListaEntradasAgendadas] = useState([])
  const [listaEntradasIniciadas, setListaEntradasIniciadas] = useState([])
  const [dadosDevolvidos, setDadosDevolvidos] = useState([])
  const [entregas, setEntregas] = useState([])
  const [clientesMaisUtilizaram, setClientesMaisUtilizaram] = useState([])
  const [nomeclientes, setNomeClientes] = useState([])
  const [ano, setAno] = useState(0);
  const [mes, setMes] = useState(0);
  const [anosArray, setAnosArray] = useState([])
  const navigate = useNavigate();
  const { ...state } = useAppState();
  const meses = [
    'Janeiro', 'Fevereiro', "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const CarregarComboAnos = () => {
    let anos = [];
    var ano = new Date();
    for (let i = 2018; i <= ano.getFullYear(); i++) {
      anos.unshift(i);
    }
    setAnosArray(anos);
  }

  const HandleChangeMes = (val) => {
    setMes(val);
    ListarDados(ano, val)
  }

  const HandleChangeAno = (val) => {
    setAno(val);
    ListarDados(val, mes)
  }

  const ListarDados = (ano, mes) => {
    var dados = { ano: ano, mes: mes }
    GetTransportesNaoIniciados(ano, mes).then(res => {
      setListaTranspNaoIniciados(res.data)
    })
    GetEntradasAgendadas(ano, mes).then(res => {
      setListaEntradasAgendadas(res.data.data)
    })
    GetDevolvidos(dados).then(res => {
      if (res.data.dados != null) {
        setDadosDevolvidos(res.data.dados.split(','))
      }
      else {
        setDadosDevolvidos('')
      }
    })
    GetEntradasIniciadas(ano, mes).then(res => {
      setListaEntradasIniciadas(res.data.data)
    })
    GetUtilizacao(dados).then(res => {
      if (res.data.dados != null) {
        console.log('dados', res.data.cliente.split(','))
        setClientesMaisUtilizaram(res.data.dados.split(','))
        setNomeClientes(res.data.cliente.split(','))
      }
      else {
        setClientesMaisUtilizaram('')
        setNomeClientes('')
      }
    })
    GetEntradasAnuais(dados).then(res => {
      if (res.data.dados != null) {
        setEntregas(res.data.dados.split(','))
      }
      else {
        setEntregas('')
      }
    })
  }

  const columnsTransporte = [
    { nome: 'N° Entrada', tipoColuna: 'texto' },
    { nome: 'Cliente', tipoColuna: 'texto' },
    { nome: 'Unidade', tipoColuna: 'texto' }
  ]

  var dataSourceTransporte =
    listaTranspNaoIniciados &&
    listaTranspNaoIniciados?.map((item) => [
      { name: item.numero },
      { name: item.cliente },
      { name: item.unidade },
    ]);

  const columnsEntradasAgendadas = [
    { nome: 'N° Entrada', tipoColuna: 'texto' },
    { nome: 'Cliente', tipoColuna: 'texto' },
    { nome: 'Agendado em', tipoColuna: 'data' },
  ]

  const VerificaCookie = () => {
    if (document.cookie.length != 0) {
      var array = document.cookie.split("=");
      if (array[0] != ".TransportadoraCookie") {
        navigate('/Login')
      }
      else {
        var dadosCookie = array[1].split('-')
        state.setUsuario(dadosCookie[0])
        state.setUnidade(dadosCookie[1])
        navigate('/Home')

      }
    }
    else {
      navigate('/')
    }
  }


  const dataSourceEntradasAgendadas =
    listaEntradasAgendadas && listaEntradasAgendadas?.map((item) => [
      { name: item.numero },
      { name: item.cliente },
      { name: item.dataAgendado }
    ])


  const columnsEntregas = [
    { nome: 'N° Entrada', tipoColuna: 'texto' },
    { nome: 'Cliente', tipoColuna: 'texto' },
    { nome: 'Filial de Saída', tipoColuna: 'texto' },
  ]

  const dataSourceEntregasIniciadas =
    listaEntradasIniciadas && listaEntradasIniciadas?.map((item) => [
      { name: item.numero },
      { name: item.cliente },
      { name: item.unidade },
    ])



  //Pie
  ChartJS.register(ArcElement, CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend);

  const data = {
    labels: nomeclientes,
    datasets: [
      {
        label: '# of Votes',
        data: clientesMaisUtilizaram,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataEntrega = {
    labels: ['Red', 'Green', 'Purple'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  //BARCHART
  const optionsDevolvidos = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Devolvidos no ano',
      },
    },
  };

  const optionsEntregas = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Entregas no ano',
      },
    },
  };

  const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const dataDevolvidos = {
    labels,
    datasets: [
      {
        label: 'Quantidade',
        data: dadosDevolvidos,
        backgroundColor: ['#D3F5F5', '#FFD9E1', '#EBE0FF', '#DBF2F2', '#FFE9D2', '#D7ECFB', '#b5f8ff', '#f6ffd9', '#1864966b', '#1801923b', '#0100ff29', '#ff017821'],
      },
    ],
  };

  const dataEntregas = {
    labels,
    datasets: [
      {
        label: 'Quantidade',
        data: entregas,
        backgroundColor: ['#D3F5F5', '#FFD9E1', '#EBE0FF', '#DBF2F2', '#FFE9D2', '#D7ECFB', '#b5f8ff', '#f6ffd9', '#1864966b', '#1801923b', '#0100ff29', '#ff017821'],
      },
    ],
  };

  useEffect(() => {
    let dataAtual = new Date();
    setAno(dataAtual.getFullYear());
    ListarDados(dataAtual.getFullYear(), 0);
    CarregarComboAnos();
    VerificaCookie();
  }, [])

  return (
    <div className="main" style={{ height: '87%' }}>
      <div className="DivCombos">
        <div style={{ display: "flex", flexDirection: "row", gap: '10px', width: '100%', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Form.Label style={{ width: 'auto' }}>Ano</Form.Label>
            <Form.Select onChange={(e) => HandleChangeAno(e.target.value)} style={{ width: "100px" }} aria-label="Default select example" className="form-select">
              {anosArray && anosArray?.map(item => (
                <option value={item} key={item}>{item}</option>
              ))}
            </Form.Select>
          </div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Form.Label style={{ width: '80%' }}>Mês</Form.Label>
            <Form.Select onChange={(e) => HandleChangeMes(e.target.value)} style={{ width: "150px" }} aria-label="Default select example">
              <option value={0}>Todos</option>

              {meses.map((item, index) => (
                <option value={index + 1} key={item}>{item}</option>
              ))}
            </Form.Select>
          </div>
        </div>
      </div>
      <div className="divPrincipal" style={{ height: '43%' }}>
        {/* Trazer os transportes que não foram iniciados, por ordem de pedido */}
        <div style={{ width: '33%', height: '100' }}>
          <Card style={{ height: '100%' }}>
            <CardHeader title="Transportes não iniciados"></CardHeader>
            <CardContent>
              <Tabela columns={columnsTransporte} dados={dataSourceTransporte}></Tabela>
            </CardContent>
          </Card>
        </div>

        {/* Trazer as entregas que estão fora de rota */}
        <div style={{ width: '33%', height: '100' }}>
          <Card style={{ height: '100%' }}>
            <CardHeader title="Entradas agendadas"></CardHeader>
            <CardContent>
              <Tabela columns={columnsEntradasAgendadas} dados={dataSourceEntradasAgendadas}></Tabela>
            </CardContent>
          </Card>
        </div>
        {/* PickUps que estão aguardando retirada */}
        <div style={{ width: '33%', height: '100' }}>
          <Card style={{ height: '100%' }}>
            <CardHeader title="Itens em rota de entrega"></CardHeader>
            <CardContent>
              <Tabela columns={columnsEntregas} dados={dataSourceEntregasIniciadas}></Tabela>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="divPrincipal" style={{ height: '49%', marginTop: '20px' }}>


        {/* Trazer as datas de entrega */}
        <div style={{ width: '33%' }}>
          <Card>
            <CardHeader title="Entregas"></CardHeader>
            <CardContent>
              <Bar options={optionsEntregas} data={dataEntregas} />
            </CardContent>
          </Card>
        </div>

        {/* Trazer dados de clientes que mais utilizaram */}
        <div style={{ width: '33%' }}>

          <Card>
          <link href="https://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></link>
            <div class="col-md-12" style={{paddingLeft: '0', height: '3%' }}>
              <div class="info">
                <i class="icon-info-sign"></i>
                <span class="extra-info">
                  Escolha um mês para o gráfico ser exibido.
                </span>
              </div><br />
            </div>
            <CardHeader title="Clientes que mais utilizaram no mês"></CardHeader>
            <CardContent>
              {nomeclientes != "" ?
                <Pie data={data}></Pie>
                :
                <LoadingBar/>
              }
            </CardContent>
          </Card>
        </div>
        {/* Trazer devolvidos por mês */}
        <div style={{ width: '33%' }}>
          <Card style={{ height: '100%' }}>
            <CardHeader title="Devolvidos por mês"></CardHeader>
            <CardContent>
              <Bar options={optionsDevolvidos} data={dataDevolvidos} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
