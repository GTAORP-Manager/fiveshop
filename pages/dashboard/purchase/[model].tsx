import { useRouter } from "next/router";
import React from "react";
import { withSessionSsr } from '@auth'
import { prisma, User } from "@db";
import axios from "axios";
import Image from "next/image";
import {
  Button,
  Paper,
  TableContainer,
  Typography,
  Table,TableHead, TableRow, TableBody, TableCell, Alert, Link} from '@mui/material'

export interface Props {
  vehicle: {
    name: string
    model: string
    price: number
    image?: string
    category: string
    type: string
  }
  user: User
}

export default function PurchaseModel(props: Props) {
  const router = useRouter();

  const [successMsg, setSuccessMsg] = React.useState<null|string>(null)
  const [disabled, setDisabled] = React.useState(false)

  const bankMoney = Number((JSON.parse(props.user.accounts || '{}')).bank)

  const bankMoneyAfter = (bankMoney - props.vehicle.price);
  const purchasePossible = bankMoneyAfter < 0;

  const startPurchase = async() => {
    const continuePurchase = window.confirm(`Bist du sicher, dass du folgendes Fahrzeug-Modell kaufen möchtest: ${props.vehicle.model} `)
    if (!continuePurchase) return window.alert('Kauf abbgebrochen')

    setDisabled(true)

    const resp = await axios.post(`/api/purchase/${props.vehicle.type}/${props.vehicle.model}`)

    if (resp.status === 200) {
      setSuccessMsg(
        `Dein Kauf wurde abgeschlossen! Dein Fahrzeug (${props.vehicle.model}) befindet sich nun in deiner Garage`
      )
      return
    } 
    return router.push('/')
  }

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
        <Typography fontSize='3rem'>Fahrzeuge</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '1.5rem' }}>Modell</TableCell>
                <TableCell style={{ fontSize: '1.5rem' }}>Preis</TableCell>
                <TableCell style={{ fontSize: '1.5rem' }}>Bild</TableCell>
                <TableCell style={{ fontSize: '1.5rem' }}>
                  Transaktion möglich
                </TableCell>
                <TableCell style={{ fontSize: '1.5rem' }}>
                  Bankkontostand nachher
                </TableCell>
                <TableCell style={{ fontSize: '1.5rem' }}>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{props.vehicle.model}</TableCell>
                <TableCell>{props.vehicle.price} $</TableCell>
                <TableCell>
                  <Image
                    width='600'
                    height='300'
                    src={props.vehicle.image || ''}
                    alt='Bild'
                  />
                </TableCell>
                <TableCell>{purchasePossible ? 'Nein' : 'Ja'}</TableCell>
                <TableCell>{bankMoneyAfter} $</TableCell>
                <TableCell>
                  <Button
                    disabled={purchasePossible || disabled}
                    onClick={startPurchase}
                  >
                    Kaufen
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {successMsg && (
          <Alert
            style={{
              marginTop: 30,
            }}
            color='success'
          >
            <Typography>{successMsg}</Typography>
            <Link href='/dashboard'>
              <Typography>Zurück zum Dashboard</Typography>
            </Link>
          </Alert>
        )}
      </Paper>
    </Paper>
  )
}

export const getServerSideProps = withSessionSsr(
  {
    ensureAuthenticated: true,
  },
  async (ctx) => {
    const cars = await prisma.vs_cars.findMany();
    const aircrafts = await prisma.vs_aircrafts.findMany()
    const boats = await prisma.vs_boats.findMany()

    const vehicles = [
      ...cars.map((c) => ({
        ...c,
        type: 'car',
      })),
      ...aircrafts.map((a) => ({
        ...a,
        type: 'aircraft',
      })),
      ...boats.map(b => ({
        ...b,
        type: 'boat'
      }))
    ]

    const model = String(ctx.query.model);

    const vehicle = vehicles.find((v) => v.model === model);

    if (!vehicle)
      return {
        props: {},
        notFound: true,
      };

    const user = await prisma.users.findFirst({
      where: {
        identifier: ctx.req.session.user.identifier
      }
    })

    if (!user) return {
      props: {},
      notFound: true,
    }

    const props: Props = {
      vehicle: {
        model,
        price: vehicle.price,
        image: vehicle.image || undefined,
        type: vehicle.type,
        category: vehicle.category || 'sportsclassics',
        name: vehicle.name,
      },
      user
    };

    return {
      props,
    };
  }
);
