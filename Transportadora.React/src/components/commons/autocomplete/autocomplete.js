import React, { useRef, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SelectAutocomplete = ({ options = [], onChange, label, readonly, id, value, mostraErro = false, required = true, style, multiple = false }) => {

    const refInput = useRef(null);
    const [showError, setShowError] = useState({ mostraErro });
    const [erro, setErro] = useState("")
    
    const onChangeHandle = (evt, val) => {
        if (onChange) {
            onChange(val, evt);
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

    if (readonly) {
        var item = options.find(x => x.id == value);
        return (
            <TextField style={style} label={label} id={id} value={item?.label || ""} readOnly={readonly}></TextField>

        )
    }
    else {
        return (

            <Autocomplete
                multiple={multiple}
                style={style}
                disablePortal
                id={id}
                size="small"
                defaultValue={value}
                isOptionEqualToValue={(option) => option.id}
                options={options}
                onChange={onChangeHandle}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField inputRef={refInput} required={required} error={showError && erro != ""}
                    helperText={erro} {...params} label={label} />}

            />

        )
    }
}

export default SelectAutocomplete;
