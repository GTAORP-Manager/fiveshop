import { prisma } from "@db";
import {
  vs_car_categories as CarCategory,
  vs_cars as Car,
  vs_aircraft_categories as AircraftCategory,
  vs_aircrafts as Aircraft,
  vs_boat_categories as BoatCategory,
  vs_boats as Boat
} from "@prisma/client";
import { GetServerSideProps, GetStaticProps } from "next";
import Image from "next/image";
import React from "react";
import { withSessionSsr } from "@auth";
import { Router, useRouter } from "next/router";
import {
  Select,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
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
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ImageIcon from '@mui/icons-material/Image'
import DriveEtaIcon from '@mui/icons-material/DriveEta'
import SailingIcon from '@mui/icons-material/Sailing'
import FlightIcon from '@mui/icons-material/Flight'

export interface Props {
  carCategories: CarCategory[];
  cars: Car[];
  aircraftCategories: AircraftCategory[]
  aircrafts: Aircraft[]
  boatCategories: BoatCategory[]
  boats: Boat[]
}

export default function vehicles(props: Props) {

  const router = useRouter()

  const [searchTerm, setSearchTerm] = React.useState('')

  const [category, setCategory] = React.useState<
    undefined | 'aircraft' | 'car' | 'boat'
  >(undefined)
  const [subCategoryId, setSubCategoryId] = React.useState<number|null>(null);

  const vehicles = React.useMemo(() => {
    const categoryVehicles =
      category === 'aircraft'
        ? props.aircrafts
        : category === 'car'
        ? props.cars
        : category === 'boat'
        ? props.boats
        : '-1'

    if (categoryVehicles === '-1') {
      console.log('Invalid category')
      return []
    }

    const vehicleList = categoryVehicles.filter((v) => {
      const categoryMatch = v.category === subCategoryId

      if (searchTerm.length > 0 && categoryMatch) {
        const search = searchTerm.toLowerCase()
        if (v.name.toLowerCase().includes(search)) return true
        else if (v.model.toLowerCase().includes(search)) return true
        else if (v.price.toString().includes(search)) return true
        else if (v.category?.toLowerCase().includes(search)) return true
        return false
      } 
      else return categoryMatch
    })

    return vehicleList
  }, [category, subCategoryId, props.aircrafts, props.cars, props.boats, searchTerm])

  React.useEffect(() => {
    setSubCategoryId(0)
  }, [category])

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

        <Box
          style={{
            display: 'flex',
            gap: 11,
            flexDirection: 'column',
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Kategorie</InputLabel>
            <Select
              label='Kategorie'
              value={category}
              onChange={(ev) => setCategory(ev.target.value as any)}
            >
              <MenuItem value='aircraft'>
                <FlightIcon
                  style={{
                    marginRight: 9,
                  }}
                />
                Luftfahrzeuge
              </MenuItem>
              <MenuItem value='car'>
                <DriveEtaIcon
                  style={{
                    marginRight: 9,
                  }}
                />
                Autos
              </MenuItem>
              <MenuItem value='boat'>
                <SailingIcon
                  style={{
                    marginRight: 9,
                  }}
                />
                Boote
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Unter-Kategorie</InputLabel>
            <Select
              disabled={category === null}
              value={subCategoryId}
              onChange={(ev) => setSubCategoryId(ev.target.value as any)}
            >
              {(category === 'aircraft'
                ? props.aircraftCategories
                : category === 'boat'
                ? props.boatCategories
                : props.carCategories
              ).map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            style={{
              marginTop: 18,
            }}
          >
            <TextField
              disabled={category == null || subCategoryId == null}
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
              id='searchterm'
              label='Suche nach Name, Modell, Kategorie, Preis...'
              variant='filled'
            />
          </FormControl>
        </Box>

        {vehicles.length >= 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: '1.5rem' }}>
                    <DirectionsCarFilledIcon
                      fontSize='small'
                      style={{ marginRight: 9 }}
                    />
                    Name
                  </TableCell>
                  <TableCell style={{ fontSize: '1.5rem' }}>
                    <Grid3x3Icon fontSize='small' style={{ marginRight: 9 }} />
                    Modell
                  </TableCell>
                  <TableCell style={{ fontSize: '1.5rem' }}>
                    <WorkspacesIcon
                      fontSize='small'
                      style={{ marginRight: 9 }}
                    />
                    Kategorie
                  </TableCell>
                  <TableCell style={{ fontSize: '1.5rem' }}>
                    <AttachMoneyIcon
                      fontSize='small'
                      style={{ marginRight: 9 }}
                    />
                    Preis
                  </TableCell>
                  <TableCell style={{ fontSize: '1.5rem' }}>
                    <ImageIcon fontSize='small' style={{ marginRight: 9 }}/>
                    Bild
                  </TableCell>
                  <TableCell style={{ fontSize: '1.5rem' }}>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((v) => (
                  <VehicleView v={v} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Paper>
  )
}

export const VehicleView = ({ v }: { v: Car }) => {

  const router = useRouter()

  return (
    <TableRow key={v.model}>
      <TableCell>{v.name}</TableCell>
      <TableCell>{v.model}</TableCell>
      <TableCell>{v.category}</TableCell>
      <TableCell>{v.price} $</TableCell>
      <TableCell>
        {v.image ? <Image width='300' height='170' src={v.image || ''} alt='Kein Bild' /> : 'Kein Bild'}
      </TableCell>
      <TableCell>
        <Button onClick={() => router.push(`/dashboard/purchase/${v.model}`)}>
          Einkaufen
        </Button>
      </TableCell>
    </TableRow>
  )
};

export const getServerSideProps: GetServerSideProps = withSessionSsr({
  ensureAuthenticated: true
}, async (ctx) => {

  const carCategories = await prisma.vs_car_categories.findMany();
  const cars = await prisma.vs_cars.findMany();

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
      boats
    },
  }
});
