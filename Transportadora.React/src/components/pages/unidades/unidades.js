import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, Box, TextField } from "@mui/material";
import Botao from '../../commons/button/button';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { CreateUnidade, EditUnidade, GetUnidades } from '../../../service/serviceUnidade';
import Tabela from '../../commons/table/table.js'
import MsgBox from "../../../helpers/msgBox";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextInput from '../../commons/text/text';
import { useAppState } from "../../../context/storeContextProvider"
import { useNavigate } from "react-router-dom";
import '../unidades/unidades.css'
//import { VerificaUsuario } from '../../../helpers/funcoes';

const Unidade = () => {
    const [unidade, setUnidade] = useState({});
    const [validated, setValidated] = useState(false);
    const form = useRef(null);
    const [listaUnidades, setListaUnidades] = useState([]);
    const [alterar, setAlterar] = useState(false);
    const [mostraAlerta, setMostraAlerta] = useState(false);
    const [salvou, setSalvou] = useState(false);
    const [erro, setErro] = useState(false)
    const { ...state } = useAppState();
    const navigate = useNavigate();

    const handleChange = (val, evt) => {
        if (evt.target.id == "hub") {
            unidade[evt.target.id] = evt.target.checked;
        }
        else{
            unidade[evt.target.id] = val;
        }
        setUnidade({ ...unidade })
    }
    const handleSubmit = (event) => {
        //const form = event.currentTarget;   
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);
    }


    async function ListarUnidades() {
        await GetUnidades().then(res => {
            setListaUnidades(res.data.data);
        })
    }

    function Salvar() {
        if (form.current.checkValidity() === true) {
            if (alterar) {
                EditUnidade(unidade).then(res => {
                    setUnidade({})
                    setSalvou(true)
                    MsgBox.Show({title: 'Sucesso', type:'s', message: "Unidade alterada com sucesso!"})
                })
            }
            else {
                CreateUnidade(unidade).then(res => {
                    setUnidade({})
                    setSalvou(true)
                    MsgBox.Show({title: 'Sucesso', type:'s', message: "Unidade salva com sucesso!"})
                })
            }
            setErro(false);
        }
        else {
            setErro(true)
        }

    }

    function CarregaUnidade(unidade) {
        setUnidade({ ...unidade })
        setAlterar(true);
        setSalvou(false)
    }

    async function BuscarCEP(cep) {
        if (cep != "") {
            const result = await axios.get(`https://viacep.com.br/ws/${cep}/json/`).catch((err)=>{
                MsgBox.Show({title: 'Erro', type:'e', message: "Erro ao buscar o CEP."})
                unidade['cep'] = ''
            })
            if(result != undefined){
                unidade['bairro'] = result.data.bairro;
                unidade['complemento'] = result.data.complemento;
                unidade['cidade'] = result.data.localidade;
                unidade['logradouro'] = result.data.logradouro;
                unidade['uf'] = result.data.uf;
            }
            setUnidade({ ...unidade })
        }
    }

    const columns = [
        { nome: 'Descrição', tipoColuna: 'texto' },
        { nome: 'CEP', tipoColuna: 'texto' },
        { nome: 'Cidade', tipoColuna: 'texto' },
        { nome: 'UF', tipoColuna: 'texto' },
        { nome: 'Logradouro', tipoColuna: 'texto' },
        { nome: 'Bairro', tipoColuna: 'texto' },
        { nome: 'N°', tipoColuna: 'texto' },
        { nome: 'Complemento', tipoColuna: 'texto' },
        { nome: 'Ações', tipoColuna: 'botao' },
    ]


    const dataSource = listaUnidades && listaUnidades?.map(item => [
        { name: item.undescricao },
        { name: item.cep },
        { name: item.cidade },
        { name: item.uf },
        { name: item.logradouro },
        { name: item.bairro },
        { name: item.numero },
        { name: item.complemento },
        {
            botoes: [{
                botao: <Botao className="text-center btnSize" size="small" variant="contained" type="button" key={`btn-${item.nome}`} text="Alterar" onClick={() => CarregaUnidade(item)} icon={<EditIcon style={{ height: '15px' }}></EditIcon>}>
                </Botao>
            }]
        }

    ]
    )

    // function MostrarMensagem() {
    //     return <Sweet mostrar={mostraAlerta} title="Sucesso" text="Dados salvos com sucesso!" type="s"></Sweet>
    // }
    useEffect(() => {
        ListarUnidades();
    }, [unidade])
    useEffect(() => {
        setMostraAlerta(salvou)
    }, [salvou])
    useEffect(() => {
        ListarUnidades();
        //VerificaUsuario();
        if (state.usuario == undefined) {
            navigate("/")
        }
    }, [])

    return (
        <>
            {/* {MostrarMensagem()} */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
                <div className='unidade' style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
                    <h4 style={{ textAlign: 'left ' }}>Unidade</h4>
                    <hr />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Box component="form"
                            ref={form}
                            style={{ width: '100%' }}
                            noValidate validated={validated}
                            autoComplete="off"
                            onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                                <h5>Dados de Cadastro</h5>
                                <div className='row'>
                                    <div className='col-md-9'>
                                        <TextInput style={{ width: '100%' }} required value={unidade.undescricao || ""} size="small" id="undescricao" label="Descrição" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                    <div className='col-md-3'>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox  onChange={(e) => handleChange(e.target.checked, e)} id='hub'/>} label="Hub de distribuição" />
                                        </FormGroup>
                                    </div>
                                </div>
                                <h5 style={{ marginTop: '20px' }}>Endereço</h5>
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <TextInput style={{ width: '100%' }} onBlur={BuscarCEP} value={unidade.cep || ""} size="small" id="cep" label="CEP" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                    <div className='col-md'>
                                        <TextInput style={{ width: '100%' }} value={unidade.logradouro || ""} size="small" id="logradouro" label="Logradouro" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className='col-md'>
                                        <TextInput style={{ width: '100%' }} value={unidade.cidade || ""} size="small" id="cidade" label="Cidade" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                    <div className='col-md'>
                                        <TextInput style={{ width: '100%' }} value={unidade.bairro || ""} size="small" id="bairro" label="Bairro" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-2'>
                                        <TextInput style={{ width: '100%' }} value={unidade.uf || ""} size="small" id="uf" label="UF" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                    <div className='col-md-2'>
                                        <TextInput style={{ width: '100%' }} value={unidade.numero || ""} size="small" id="numero" label="Número" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                    <div className='col-md'>
                                        <TextInput required={false} style={{ width: '100%' }} value={unidade.complemento || ""} size="small" id="complemento" label="Complemento" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2%' }} className="btnSalvar">
                        <Botao  style={{ height: '4vh', width: '7vw' }} className="text-center btnSalvar" size="small" variant="contained" color="success" type="button" text="Salvar" key={`btnSalvar`} onClick={() => Salvar()} icon={<SaveIcon style={{ height: '15px' }}></SaveIcon>}>
                        </Botao>
                    </div>
                    <div className='hideCelular' style={{ display: 'flex', justifyContent: 'center', marginTop: '45px' }}>
                        <Tabela columns={columns} dados={dataSource} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Unidade;