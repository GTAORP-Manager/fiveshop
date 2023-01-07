import React from 'react'
import { Box, Paper } from '@mui/material'
import Header from '@components/Header'
import Footer from '@components/Footer'

export interface Props {
  children: any
  noDisplayElevation?: true
  noFooter?: true
  noHeader?: true
}

export default function Site(props: Props) {
  return (
    <Paper
      elevation={1}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        //padding: 50,
      }}
    >
      {!props.noHeader && 
        <Header 

        />
      }

      <Paper
        elevation={props.noDisplayElevation == true ? -1 : 5}
        style={{
          width: '100%',
          height: '85%', // props.noFooter ? '100%' : '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          overflowY: 'scroll'
        }}
      >
        {props.children}
      </Paper>

      {!props.noFooter && <Footer></Footer>}
    </Paper>
  )
}
