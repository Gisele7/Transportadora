import React from 'react'
import Button from '@mui/material/Button'

const Botao = ({style, className, variant, type, onClick, text, icon, size, color= "primary", id}) => {
    return (
        <Button style={style} className={className} id={id} variant={variant} type={type} onClick={onClick} size={size} color={color} >
           {icon}
           {text}
        </Button>
    )
}
export default Botao;