import React, { useRef, useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

const CustomSelect = ({ options = [], id, label, value, onChange, mostraErro, required = true, style, InputLabelProps, key }) => {
    const refInput = useRef(null);
    const [showError, setShowError] = useState({ mostraErro });
    const [erro, setErro] = useState("")

    const onChangeHandle = (evt) => {
        if (onChange) {
            onChange(evt.target.value, evt);
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

    return (
        <FormControl size="small" error={showError && erro != null} style={style}>
            <InputLabel id="demo-select-small-label" shrink={value != "" ? true : false}>{label} </InputLabel>
            <Select
                key={key}
                labelId="demo-select-small-label"
                id={id}
                required={required}
                defaultValue={value}
                label={label}
                native={true}
                inputRef={refInput}
                onChange={onChangeHandle}
                notched={value != "" ? true : false}
            >
                <option value={null} key='option'></option>
                {options && options?.map(item => <option key={item.id} value={item.id}>{item.label}</option>
                )}
            </Select>
            <FormHelperText>{erro}</FormHelperText>
        </FormControl>
    )

}

export default CustomSelect;
