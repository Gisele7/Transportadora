import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, Box, TextField, Autocomplete } from "@mui/material";
import Botao from "../../commons/button/button";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tabela from '../../commons/table/table';
import { CarregaUsuarios, CreateUsuario, EditUsuario, GetUnidades, ListarGrupos, ListarUsuario } from '../../../service/serviceUsuario.js';
import TextInput from '../../commons/text/text';
import MsgBox from '../../../helpers/msgBox';
import CustomSelect from '../../commons/select/select';
import SelectAutocomplete from '../../commons/autocomplete/autocomplete';
import { useAppState } from "../../../context/storeContextProvider"
import { useNavigate } from "react-router-dom";
import '../usuario/usuario.css';

const Usuario = () => {
    const [usuario, setUsuario] = useState({});
    const [unidades, setUnidades] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [dados, setDados] = useState([]);
    const [gruposUsuario, setGruposUsuario] = useState([]);
    const [alterarDados, setAlterarDados] = useState(false)
    const [recarregaTabela, setRecarregaTabela] = useState(false)
    const [erro, setErro] = useState(false)
    const [salvou, setSalvou] = useState(false);
    const [mostraAlerta, setMostraAlerta] = useState(false);
    const [validated, setValidated] = useState(false);
    const form = useRef(null)
    const { ...state } = useAppState();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        //const form = event.currentTarget;  
    }

    // function MostrarMensagem() {
    //     return <Sweet mostrar={mostraAlerta} title="Sucesso" text="Dados salvos com sucesso!" type="s"></Sweet>
    // }

    function Salvar() {
        if (form.current.checkValidity() === true) {
            if (alterarDados) {
                EditUsuario(usuario).then(res => {
                    setAlterarDados(false)
                    setUsuario({})
                    setSalvou(true)
                })
            }
            else {
                var teste = [];
                gruposUsuario && gruposUsuario?.map(item => {
                    teste.push({ GucodGrupo: item.id })
                })
                usuario["grupoUsuario"] = teste
                CreateUsuario(usuario).then(res => {
                    console.log("res", res.data.data)
                    setDados(res.data.data)
                    setAlterarDados(false)
                    setUsuario({})
                    setSalvou(true)
                })
            }
            setErro(false);
        }
        else {
            setErro(true)
        }
    }

    function ListarDados() {
        CarregaUsuarios().then(res => {
            console.log('carrega', res.data)
            setDados(res.data)
        })
        GetUnidades().then(res => {
            setUnidades(res.data.data)
        })

        ListarGrupos().then(res => {
            setGrupos(res.data.data)
        })
    }

    const handleChange = (val, evt) => {
        if (evt.target.localName == "li") {
            let index = evt.target.id.indexOf("-");
            setGruposUsuario((prevState) => [...prevState, val.id])
            if (evt.target.id.substring(0, index) == "codUnidade") {
                usuario[evt.target.id.substring(0, index)] = val.id;
            }
        }
        else {
            usuario[evt.target.id] = val
        }
        setUsuario({ ...usuario })
    }
    const CarregarUsuario = (user) => {
        setUsuario(user);
        let listaGrupos = []
        user.grupos && user.grupos?.map(item => {
            listaGrupos.push({
                label: item.gpdescricao,
                id: item.gpcodigo.toString()
            })
        })
        setGruposUsuario(listaGrupos)
        setAlterarDados(true)
    }

    //Colunas da tabela
    const columns = [
        { nome: 'Nome', tipoColuna: 'texto' },
        { nome: 'Unidade', tipoColuna: 'texto' },
        { nome: 'Ações', tipoColuna: 'botao' },
    ]
    
    const dataSource = dados && dados?.map(item => [
        { name: item.nome, corLinha: '' },
        { name: item.unidade, corLinha: '' },
        {
            botoes: [{
                botao: <Botao className="text-center btnSize" size="small" variant="contained" type="button" key={`btn-${item.nome}`} text="Alterar" onClick={() => CarregarUsuario(item)} icon={<EditIcon style={{ height: '15px' }}></EditIcon>}>
                </Botao>
            }]
        }
    ])

    const optionsUnidades = [];
    unidades &&
        unidades?.map((item) => [
            optionsUnidades.push({ label: item.undescricao, id: item.uncodigo }),
        ]);

    const optionsGrupos = [];
    grupos &&
        grupos?.map((item) => [
            optionsGrupos.push({ label: item.gpdescricao, id: item.gpcodigo }),
        ]);

    useEffect(() => {
        ListarDados();
        if (state.usuario == undefined) {
            navigate("/")
        }
    }, [])
    useEffect(() => {
        setMostraAlerta(salvou)
    }, [salvou])

    return (
        <>
            {/* {MostrarMensagem()} */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
                <div className="cliente" style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
                    <h4 style={{ textAlign: 'left ' }}>Usuário</h4>
                    <hr />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '30ch' }, }}
                            ref={form}
                            style={{ width: '100%' }}
                            noValidate validated={validated}
                            autoComplete="off">
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <TextInput style={{ width: '100%' }} value={usuario.nome || ""} size="small" id="nome" label="Nome" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                    <div className="col-md-4">
                                        <TextInput type="password" style={{ width: '100%' }} value={usuario.senha || ""} size="small" id="senha" label="Senha" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                    <div className="col-md-2" >
                                        <Autocomplete
                                            multiple
                                            value={gruposUsuario}
                                            onChange={(event, newValue) => {
                                                setGruposUsuario(newValue.map((option) => option.value || option));
                                            }}
                                            isOptionEqualToValue={(option, value) => option.value === value}
                                            getOptionLabel={(option) => {
                                                console.log('option', option)
                                                if (typeof option === "number") {
                                                    return find((item) => item.id === option)?.label;
                                                } else {
                                                    return option.label;
                                                }
                                            }}
                                            size="small"
                                            id="controllable-states-demo"
                                            options={optionsGrupos}
                                            sx={{ width: '100%' }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Grupos" />
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <SelectAutocomplete style={{ width: '100%' }} value={usuario.codUnidade || ""} label="Unidade" options={optionsUnidades} onChange={handleChange} id="codUnidade" mostraErro={erro}>
                                        </SelectAutocomplete>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2%' }} className="btnSalvar">
                        <Botao className="text-center" size="small" variant="contained" color="success" type="button" text="Salvar" key={`btnSalvar`} onClick={() => Salvar()} icon={<SaveIcon style={{ height: '15px' }}></SaveIcon>}>
                        </Botao>
                    </div>
                    <div className='hideCelular' style={{ display: 'flex', justifyContent: 'center', marginTop: '45px' }}>
                        <Tabela columns={columns} dados={dataSource}></Tabela>
                    </div>
                </div>
            </div>


        </>

    )

}

export default Usuario;