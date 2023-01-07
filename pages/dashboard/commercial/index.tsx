import { prisma } from '@db'
import {
  vs_car_categories as CarCategory,
  vs_cars as Car,
  vs_aircraft_categories as AircraftCategory,
  vs_aircrafts as Aircraft,
  vs_boat_categories as BoatCategory,
  vs_boats as Boat,
} from '@prisma/client'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { withSessionSsr } from '@auth'
import { Router, useRouter } from 'next/router'
import {
  Button,
  Paper,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import Site from '@components/Site'

export interface Props {
  carCategories: CarCategory[]
  cars: Car[]
  aircraftCategories: AircraftCategory[]
  aircrafts: Aircraft[]
  boatCategories: BoatCategory[]
  boats: Boat[]
}

export default function vehicles(props: Props) {
  const router = useRouter()

  return (
    <Site noDisplayElevation>
      <Paper
        elevation={3}
        style={{
          padding: 50,
          width: '50%',
        }}
      >
        <Button onClick={() => router.back()}>Zurück</Button>
        <Typography fontSize='3rem'>Online Shop</Typography>

        <Box
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 30,
            flexDirection: 'column',
          }}
        >
          <Button
            onClick={() => router.push('/dashboard/commercial/vehicles')}
            style={{ borderColor: '#f7c334', color: 'white' }}
            variant='outlined'
          >
            Fahrzeugshop
          </Button>
          <Button
            disabled
            onClick={() => router.push('/dashboard/commercial/items')}
            // style={{ borderColor: '#7c40bd', color: 'white' }}
            variant='outlined'
          >
            Itemshop
          </Button>
        </Box>
      </Paper>
    </Site>
  )
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  {
    ensureAuthenticated: true,
  },
  async (ctx) => {
    const carCategories = await prisma.vs_car_categories.findMany()
    const cars = await prisma.vs_cars.findMany()

    const aircraftCategories = await prisma.vs_aircraft_categories.findMany()
    const aircrafts = await prisma.vs_aircrafts.findMany()

    const boatCategories = await prisma.vs_boat_categories.findMany()
    const boats = await prisma.vs_boats.findMany()

    return {
      props: {
        carCategories,
        cars,
        aircraftCategories,
        aircrafts,
        boatCategories,
        boats,
      },
    }
  }
)
