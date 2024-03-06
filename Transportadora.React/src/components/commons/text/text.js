import { TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import InputMask from 'react-input-mask'
import { FormatColorReset } from '@mui/icons-material';

// import '../../../assets/app.css';


const TextInput = ({ required = true, ocultarPlaceHolder = false, value, size = "small", id, label, variant = "outlined", onChange, mostraErro = false, type = "text", disabled = false, style, onBlur, mask = '', InputLabelProps, InputProps, className }) => {
    const refInput = useRef(null);
    const [showError, setShowError] = useState({ mostraErro });
    const [erro, setErro] = useState("")

    const onChangeHandle = (evt) => {
        if (onChange) {
            onChange(evt.target.value, evt);
        }
    }

    const onBlurHandle = (evt) => {
        if (onBlur) {
            onBlur(evt.target.value, evt);
        }
    }

    function Validate() {
        if (refInput && refInput.current) {
            var retorno = refInput.current.checkValidity();
            if (retorno) {
                setErro("");
            }
            else {
                setErro("Campo Obrigatório");
            }

            return retorno;
        }

        return false;
    }
    useEffect(() => {

        if (mostraErro) {
            setShowError(true)
            Validate();
        }
        else {
            setShowError(false)
            setErro("")
        }



    }, [mostraErro])
    if (mask != "") {
        return (
            <InputMask mask={mask} value={value} onChange={onChangeHandle} onBlur={onBlurHandle} disabled={disabled} >
                <TextField
                    className={className}
                    InputProps={InputProps}
                    InputLabelProps={InputLabelProps}
                    style={style}
                    inputRef={refInput}
                    required={required}
                    // InputLabelProps={{ shrink: type == "date" ? true : false }}
                    size={size}
                    id={id}
                    label={label}
                    variant={variant}
                    error={showError && erro != ""}
                    helperText={erro}
                />
            </InputMask>
        )
    }
    else {

        return (

            <TextField
                InputProps={InputProps}
                InputLabelProps={InputLabelProps}
                inputRef={refInput}
                required={required}
                value={value}
                // InputLabelProps={{ shrink: ocultarPlaceHolder}}
                size={size}
                id={id}
                label={label}
                variant={variant}
                onChange={onChangeHandle}
                error={showError && erro != ""}
                helperText={erro}
                type={type}
                disabled={disabled}
                style={style}
                onBlur={onBlurHandle}

            />
        )

    }

}

export default TextInput;
