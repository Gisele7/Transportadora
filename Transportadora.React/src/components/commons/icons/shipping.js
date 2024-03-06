import React from 'react'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Shipping = ({index = 0}) => {
    if(parseInt(index) % 2 == 0){
        return <LocalShippingIcon  />
    }
    else{
        return <LocalShippingIcon style={{transform: 'scale(-1, 1)'}} />
    }
    
}

export default Shipping