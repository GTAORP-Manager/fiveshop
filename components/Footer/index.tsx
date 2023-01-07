import { manifest } from '@appConfig'
import { Paper, Box, Typography } from '@mui/material'
import React from 'react'

export default function Footer() {
  return (
    <Paper
      elevation={2}
      style={{
        width: '100%',
        //position: 'absolute',
        height: '5%',
        //bottom: 0,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '70%',
          height: 'auto',
          padding: 15
        }}
      >
        <Typography color='#515251'>Fiveshop 2022 [FiveRP] [{manifest.version}]</Typography>
        <Typography color='#515251'>&copy; Trebossalol, 2022</Typography>
      </Box>
    </Paper>
  )
}
