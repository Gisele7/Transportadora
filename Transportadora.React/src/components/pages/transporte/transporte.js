import React, { useEffect, useState, useDeferredValue } from "react";
import Tabela from "../../commons/table/table";
import Botao from "../../commons/button/button";
import EditIcon from "@mui/icons-material/Edit";
import { useAppState } from "../../../context/storeContextProvider";
import { useNavigate } from "react-router-dom";
import { CarregarEntradas, IniciarTransporte } from '../../../service/serviceTransporte'
import MsgBox from '../../../helpers/msgBox';
import TextInput from "../../commons/text/text";
import '../transporte/transporte.css'
import Loading from "../../commons/loading/loading";

const Transporte = () => {
  const [listaEntradas, setListaEntradas] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState(0);
  const [listaCliente, setListaCliente] = useState([]);
  const [listaUnidade, setListaUnidade] = useState([]);
  const [unidade, setUnidade] = useState(0);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [listaOld, setListaOld] = useState([]);
  const { ...state } = useAppState();


  const navigate = useNavigate();

  const ListarEntradas = () => {
    CarregarEntradas(state.unidade, null).then(res => {
      console.log('res', res.data)
      setListaEntradas(res.data.data);
    }).catch(err => console.log('err', err));
  }

  function searchResults(pesquisa) {
    if (pesquisa.length > 3) {
      setListaOld(listaEntradas)
      const dados = listaEntradas.filter(x => x.numeroRastreio.includes(pesquisa) ||
        x.numeroNotaFiscal.includes(pesquisa) || x.cliente.includes(pesquisa) || x.unidade.includes(pesquisa));
      setListaEntradas(dados)
      // CarregarEntradas(state.unidade, pesquisa).then(res => {
      //   setListaEntradas(res.data.data)
      // });
    }
    else if (pesquisa.length == 0) {
      setListaEntradas(listaOld);
    }
  }

  function PostTransporte(codEntrada) {
    IniciarTransporte(codEntrada).then(res => {
      MsgBox.Show({ title: 'Sucesso', type: 's', message: "Transporte iniciado com sucesso!" })
      console.log('transporte', res.data)
    }).finally(() => {
      ListarEntradas();
    }
    )
  }

  const columns = [
    { nome: "N° de Rastreio", tipoColuna: "texto" },
    { nome: "N° Nota Fiscal", tipoColuna: "texto" },
    { nome: "Cliente", tipoColuna: "texto" },
    { nome: "Unidade", tipoColuna: "texto" },
    { nome: "Ação", tipoColuna: "botao" },
  ];

  var dadosTabela =
    listaEntradas &&
    listaEntradas?.map((item) => [
      { name: item.numeroRastreio, corLinha: item.numeroRastreio == "" ? '' : 'corLinhaTransporte' },
      { name: item.numeroNotaFiscal, corLinha: item.numeroRastreio == "" ? '' : 'corLinhaTransporte' },
      { name: item.cliente, corLinha: item.numeroRastreio == "" ? '' : 'corLinhaTransporte' },
      { name: item.unidade, corLinha: item.numeroRastreio == "" ? '' : 'corLinhaTransporte' },
      {
        botoes: [
          {
            botao: (
              <Botao
                className="text-center"
                size="small"
                variant="contained"
                type="button"
                text="Iniciar Transporte"
                style={{ marginRight: "5px", display: item.numeroRastreio == "" ? 'block' : 'none' }}
                onClick={() => PostTransporte(item.codigoEntrada)}
                icon={<EditIcon style={{ height: "15px" }}></EditIcon>}
              ></Botao>
            ),
          },
        ],
      },
    ]);

  useEffect(() => {
    console.log('listaEntradas', listaEntradas)
    ListarEntradas();
  }, []);
  useEffect(() => {
    if (listaEntradas.length > 0) {
      console.log('qqq',listaEntradas.length)
      setLoading(false)
    }
    else if(listaEntradas.length == 0){
        setLoading(false)
    }
    else {
      console.log('aq',listaEntradas.length)
      setLoading(true)
    }
  }, [listaEntradas]);


  return (
    <>
      {loading ?
        <Loading />
        :
        <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
            <h4>Transporte</h4>
            <hr />
            <label>
              Pesquise:
            </label>
            <TextInput onChange={(searchVal) => searchResults(searchVal)}></TextInput>
            <Tabela
              className="responsive"
              columns={columns}
              dados={dadosTabela}
              showPagination={true}
            />
          </div>
        </div>
      }
    </>
  );
};

export default Transporte;
