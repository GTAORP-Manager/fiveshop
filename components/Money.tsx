import { Typography } from '@mui/material'
import React from 'react'

export default (props: any) => {
    const isNumber = !isNaN(props.children)

    if (!isNumber) {
        console.error(`${props.children} is not a number`)
        return <Typography>NaN</Typography>
    }

    const value = Number(props.children)

    return <Typography>{value/1000} k$</Typography>
    
}
