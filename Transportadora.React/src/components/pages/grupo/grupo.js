import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, Box, TextField } from "@mui/material";
import Botao from "../../commons/button/button";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tabela from '../../commons/table/table';
import { CreateGrupo, DeleteGrupo, EditGrupo, ListarGrupos } from '../../../service/serviceGrupo';
import TextInput from '../../commons/text/text';
import MsgBox from '../../../helpers/msgBox';
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../context/storeContextProvider";

const Grupo = () => {
    const [grupo, setGrupo] = useState({});
    const [dados, setDados] = useState([]);
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
                EditGrupo(grupo).then(res => {
                    setAlterarDados(false)
                    setGrupo({})
                    setSalvou(true)
                    MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados alterados com sucesso!" })
                })
            }
            else {
                CreateGrupo(grupo).then(res => {
                    setAlterarDados(false)
                    setGrupo({})
                    setSalvou(true)
                    MsgBox.Show({ title: 'Sucesso', type: 's', message: "Dados salvos com sucesso!" })
                })
            }
            setErro(false);
        }
        else {
            setErro(true)
        }
    }

    function ListarDados() {
        ListarGrupos().then(res => {
            setDados(res.data.data)
        })
    }

    const handleChange = (val, evt) => {
        grupo[evt.target.id] = val
        setGrupo({ ...grupo })
    }

    const CarregarGrupo = (grupo) => {
        setGrupo(grupo);
        setAlterarDados(true)
    }


    const ExcluirGrupo = (codGrupo) => {
        MsgBox.ConfirmExclude({ message: 'Deseja realmente excluir o grupo?', type: 'w', title: 'Exclusão', btnCancel: true, textConfirm: 'Sim, exlcuir' })
            .then(result => {
                if (result.isConfirmed) {
                    DeleteGrupo(codGrupo).then((res) => {
                        setAlterarDados(false);
                        setGrupo({});
                        ListarDados();
                    });
                }
            })
    };

    //Colunas da tabela
    const columns = [{ nome: 'Descrição', tipoColuna: 'texto' },
    { nome: 'Ações', tipoColuna: 'botao' }
    ]

    //dados da tabela
    const dataSource = dados && dados?.map(item => [
        { name: item.gpdescricao, corLinha: '' },
        {
            botoes: [{
                botao: <Botao className="text-center" size="small" variant="contained" type="button" text="Alterar" style={{ marginRight: '5px' }} onClick={() => CarregarGrupo(item)} icon={<EditIcon style={{ height: '15px' }}></EditIcon>}>
                </Botao>
            },
            {
                botao: (
                    <Botao
                        className="text-center"
                        size="small"
                        variant="contained"
                        color="error"
                        type="button"
                        text="Excluir"
                        onClick={() => ExcluirGrupo(item.gpcodigo)}
                        icon={<DeleteIcon style={{ height: "15px" }} />}
                    ></Botao>
                ),
            },
            ]
        }
    ])


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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
                <div className='grupo' style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
                    <h4 style={{ textAlign: 'left ' }}>Grupo</h4>
                    <hr />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '30ch' }, }}
                            ref={form}
                            style={{ width: '100%' }}
                            noValidate validated={validated}
                            autoComplete="off">
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                                <div className='row'>
                                    <div className="col-md">
                                        <TextInput style={{ width: '100%' }} value={grupo.gpdescricao || ""} size="small" id="gpdescricao" label="Descricao" variant="outlined" onChange={handleChange} mostraErro={erro} />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                        <Botao style={{ height: '4vh', width: '7vw' }} className="text-center" size="small" variant="contained" color="success" type="button" text="Salvar" key={`btnSalvar`} onClick={() => Salvar()} icon={<SaveIcon style={{ height: '15px' }}></SaveIcon>}>
                        </Botao>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '45px' }}>
                        <Tabela columns={columns} dados={dataSource}></Tabela>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Grupo;