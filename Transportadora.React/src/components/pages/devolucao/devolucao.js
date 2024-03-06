import React, { useState, useRef } from 'react'
import { Box } from "@mui/material";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useAppState } from "../../../context/storeContextProvider"
import { useNavigate } from "react-router-dom";

const Devolucao = () => {
    const [validated, setValidated] = useStatetate(false);
    const form = useRef(null);
    const [erro, setErro] = useState(false)
    const { ...state } = useAppState();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        //const form = event.currentTarget;   
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
                <div className='devolucao' style={{ display: 'flex', flexDirection: 'column', padding: '30px', width: '70%' }}>
                    <h4 style={{ textAlign: 'left ' }}>Devolução</h4>
                    <hr />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Box component="form"
                            ref={form}
                            style={{ width: '100%' }}
                            noValidate validated={validated}
                            autoComplete="off"
                            onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                                <h5>Dados da devolução</h5>
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox onChange={(e) => handleChange(e.target.checked, e)} id='hub' />} label="Hub de distribuição" />
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Devolucao;