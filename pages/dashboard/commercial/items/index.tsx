import { prisma } from "@db";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React from "react";
import { withSessionSsr } from "@auth";
import { Router, useRouter } from "next/router";
import {
  Button,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
} from '@mui/material'
import { Box } from "@mui/system";

import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'

export interface BuyableItem {
  label: string
  name: string
  price: number
  maxQuantity?: number
}

export interface Props {
  items: BuyableItem[]
}

export default function Items(props: Props) {

  const router = useRouter()

  const [searchTerm, setSearchTerm] = React.useState('')

  const items = React.useMemo(() => {

    const itemList = props.items.filter((i) => {

      if (searchTerm.length > 0) {
        const search = searchTerm.toLowerCase()
        if (i.name.toLowerCase().includes(search)) return true
        else if (i.label.toLowerCase().includes(search)) return true
        else if (i.price.toString().includes(search)) return true
        return false
      } 
      
      return props.items
    })

    return itemList
  }, [props.items, searchTerm])

  return (
    <Paper
      style={{
        width: '100vw',
        minHeight: '100vh',
        height: 'auto',
        transition: '1s all ease-in',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: 50,
          width: '75%',
        }}
      >
        <Button onClick={() => router.back()}>Zurück</Button>
        <Typography fontSize='3rem'>Items</Typography>

        <Box
          style={{
            display: 'flex',
            gap: 11,
            flexDirection: 'column',
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <FormControl
            fullWidth
            style={{
              marginTop: 18,
            }}
          >
            <TextField
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
              id='searchterm'
              label='Suche nach Name, Preis...'
              variant='filled'
            />
          </FormControl>
        </Box>

        {items.length >= 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: '1.5rem' }}>
                    Name
                  </TableCell>
                  <TableCell style={{ fontSize: '1.5rem' }}>
                    Preis
                  </TableCell>
                  <TableCell style={{ fontSize: '1.5rem' }}>
                    Aktionen
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((i) => (
                  <ItemView i={i} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Paper>
  )
}

export const ItemView = ({ i }: { i: BuyableItem }) => {

  const router = useRouter()

  return (
    <TableRow key={`item.${i.name}`}>
      <TableCell>{i.label}</TableCell>
      <TableCell>{i.price} $</TableCell>
      <TableCell>
        <Button>
          Einkaufen
        </Button>
      </TableCell>
    </TableRow>
  )
};

export const getServerSideProps: GetServerSideProps = withSessionSsr({
  ensureAuthenticated: true
}, async (ctx) => {

  const items: BuyableItem[] = [
    {
      label: 'Brot',
      name: 'bread',
      price: 250
    },
    {
      label: 'Wasser',
      name: 'water',
      price: 250
    }
  ]

  return {
    props: {
      items
    },
  }
});
