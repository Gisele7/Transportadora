import React, { useEffect, useState, useRef } from 'react';
import { CreateOcorrencia, GetEntradas, GetOcorrencias, GetResultadoOcorrencia, GetTipoOcorrencia } from '../../../service/serviceRegistroOcorrencia';
import { Box } from "@mui/material";
import TextInput from '../../commons/text/text';
import SelectAutocomplete from "../../commons/autocomplete/autocomplete";
import { useAppState } from '../../../context/storeContextProvider';
import { useNavigate } from "react-router-dom";
import Botao from "../../commons/button/button";
import SaveIcon from '@mui/icons-material/Save';
import MsgBox from "../../../helpers/msgBox";
import Tabela from '../../commons/table/table';
import moment from 'moment';
import '../ocorrencia/ocorrencia.css';

const RegistroOcorrencia = () => {
    const [entrada, setEntrada] = useState('')
    const [resultadoOcorrencia, setResultOcorrencia] = useState('')
    const [tipoOcorrencia, setTipoOcorrencia] = useState('')
    const [tipoOcorrencias, setTipoOcorrencias] = useState([]);
    const [ocorrencia, setOcorrencia] = useState({});
    const [resultadoOcorrencias, setResultadoOcorrencias] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [listaOcorrencia, setListaOcorrencia] = useState([]);
    const [validated, setValidated] = useState(false);
    const [erro, setErro] = useState(false);
    const [alterar, setAlterar] = useState(false);
    const { ...state } = useAppState();
    const navigate = useNavigate();
    const [salvou, setSalvou] = useState(false);
    const form = useRef(null);

    const CarregarDados = () => {
        GetTipoOcorrencia().then((res) => {
            setTipoOcorrencias(res.data.data)
        })
        GetResultadoOcorrencia().then((res) => {
            setResultadoOcorrencias(res.data.data)
        })
        GetEntradas().then((res) => {
            setEntradas(res.data.data)
        })
        GetOcorrencias().then(res => {
            setListaOcorrencia(res.data.data);
        })

    }

    const handleChange = (val, evt) => {
        if (evt.target.localName == "li") {
            let index = evt.target.id.indexOf('-', 0);
            if (evt.target.id.substring(0, index) == 'occodEntrada') {
                ocorrencia['occodEntrada'] = val;
            }
            else if (evt.target.id.substring(0, index) == 'tipoOcorrencia') {
                ocorrencia['occodTipoEntrada'] = val;
            }
            else if (evt.target.id.substring(0, index) == 'resultadoOcorrencia') {
                console.log('resultadoOcorrencia', val, resultadoOcorrencia)
                ocorrencia['occodResultadoOcorrencia'] = val;
            }
            setOcorrencia({ ...ocorrencia })
        }
        else {
            ocorrencia[evt.target.id] = val;
            setOcorrencia({ ...ocorrencia })
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        //const form = event.currentTarget;
    };

    const columns = [
        { nome: 'Descrição', tipoColuna: 'texto' },
        { nome: 'Tipo de ocorrência', tipoColuna: 'texto' },
        { nome: 'Resultado da Ocorrência', tipoColuna: 'texto' },
        { nome: 'Data', tipoColuna: 'texto' },
        { nome: 'Entrada', tipoColuna: 'texto' },
    ]

    const dataSource = listaOcorrencia && listaOcorrencia?.map(item => [
        { name: item.descricao },
        { name: item.tipoOcorrencia },
        { name: item.resultadoOcorrencia },
        { name: moment(item.data).format('DD/MM/YYYY') },
        { name: item.codEntrada },
    ]
    )

    const Salvar = () => {
        if (form.current.checkValidity() === true) {
            console.log(resultadoOcorrencia)
            ocorrencia['occodEntrada'] = entrada.id;
            ocorrencia['occodResultadoOcorrencia'] = resultadoOcorrencia.id;
            ocorrencia['occodTipoOcorrencia'] = tipoOcorrencia.id;
            console.log('ocorrencia', ocorrencia)
            console.log('alterar', alterar)
            if (alterar == true) {
                // EditCliente(cliente).then(res => {
                //   setSalvou(true)
                //   MsgBox.Show({title: 'Sucesso', type:'s', message: "Dados alterados com sucesso!"})
                // })
            }
            else {
                CreateOcorrencia(ocorrencia).then(res => {
                    setOcorrencia({})
                    setSalvou(true)
                    MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados salvos com sucesso!" })
                })
            }
            setErro(false)
        }
        else {
            setErro(true)
        }
    }

    const optionsTipoOcorrencia = [];
    tipoOcorrencias &&
        tipoOcorrencias?.map((item) => [
            optionsTipoOcorrencia.push({ label: item.tcdescricao, id: item.tccodigo }),
        ]);
   
        const optionsResultadoOcorrencia = [];
    resultadoOcorrencias &&
        resultadoOcorrencias?.map((item) => [
            optionsResultadoOcorrencia.push({ label: item.rcdescricao, id: item.rccodigo }),
        ]);

    const optionsEntradas = [];
    entradas &&
        entradas?.map((item) => [
            optionsEntradas.push({ label: item.numero, id: item.codigoEntrada }),
        ]);

    useEffect(() => {
        CarregarDados();
        if (state.usuario == undefined) {
            navigate("/")
        }
    }, [])
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", padding: "30px", width: "70%", }}>
                    <h4 style={{ textAlign: "left " }}>Ocorrência</h4>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}></div>
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
                                <h5>Dados da Entrada</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <SelectAutocomplete
                                            style={{ width: "100%" }}
                                            value={entrada || ""}
                                            label="Entradas"
                                            options={optionsEntradas}
                                            onChange={setEntrada}
                                            id="entrada"
                                            mostraErro={erro}
                                        ></SelectAutocomplete>
                                    </div>
                                    <div className="col-md-6">
                                        <SelectAutocomplete
                                            style={{ width: "100%" }}
                                            value={tipoOcorrencia || ""}
                                            label="Tipo de Ocorrência"
                                            options={optionsTipoOcorrencia}
                                            onChange={setTipoOcorrencia}
                                            id="tipoOcorrencia"
                                            mostraErro={erro}
                                        ></SelectAutocomplete>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md'>
                                        <div className="descricaoOcorrencia">
                                            <TextInput className="descricao" style={{ width: '100%' }} required value={ocorrencia.ocdescricao || ""} size="small" id="ocdescricao" label="Descrição" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md">
                                        <SelectAutocomplete
                                            style={{ width: "100%" }}
                                            value={resultadoOcorrencia || ""}
                                            label="Resultado da Ocorrência"
                                            options={optionsResultadoOcorrencia}
                                            onChange={setResultOcorrencia}
                                            id="resultadoOcorrencia"
                                            mostraErro={erro}
                                            required={false}
                                        ></SelectAutocomplete>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }} className="btnSalvar">
                                    <Botao className="text-center" size="medium" variant="contained" color="success" type="button" text="Salvar" key={`btnSalvar`} onClick={() => Salvar()} icon={<SaveIcon style={{ height: '15px' }}></SaveIcon>}>
                                    </Botao>
                                </div>
                            </div>
                        </Box>
                    </div>
                <div className='hideCelular' style={{ display: 'flex', justifyContent: 'center', marginTop: '45px' }}>
                    <Tabela columns={columns} dados={dataSource} />
                </div>
                </div>
            </div>
        </>
    )
}

export default RegistroOcorrencia;