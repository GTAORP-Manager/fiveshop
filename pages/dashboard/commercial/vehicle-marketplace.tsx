import { withSessionSsr } from '@auth'
import {
  Paper,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import {prisma} from '@db'
import {
  web_vehicle_marketplace as MarketPlaceVehicle,
  owned_vehicles as UserVehicle
} from '@prisma/client'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Image from 'next/image'
import axios from 'axios'

export interface Props {
  marketplaceVehicles: MarketPlaceVehicle[]
  userVehicles: UserVehicle[]
  ownerIdentifier: string
  players: {last_name: string, first_name: string, identifier: string}[]
}

export default function VehicleMarketplace(props: Props) {
  
  const router = useRouter()
  const [disabled, setDisabled] = React.useState(false)

  const [vehiclePlate, setVehiclePlate] = React.useState<null|string>(null)
  const vehicle = React.useMemo(() => props.userVehicles.find(v => v.plate === vehiclePlate), [props.userVehicles, vehiclePlate])

  const addVehicle = React.useCallback(async () => {

    if (!vehiclePlate) return alert('Kein Fahrzeug ausgewählt')

    setDisabled(true)

    const resp = await axios.post(
      `/api/marketplace/add`, {
        plate: vehiclePlate
      }
    )

    setDisabled(false)

    if (resp.status === 200) {
      await router.replace(router.asPath)
      return
    }
    return router.push('/')
  },[vehiclePlate])
  
  const vehiclesAvailable = React.useMemo(() =>
    props.userVehicles.filter((veh) => {
      const exists = props.marketplaceVehicles.find(
        (v) => v.plate === veh.plate
      )
      return !exists
    }), [
      props.marketplaceVehicles,
      props.userVehicles
    ]
  )

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
        <Typography fontSize='3rem'>Fahrzeughandel</Typography>

        <Box>
          {props.marketplaceVehicles.length < 1 ? (
            <Alert severity='warning'>
              <Typography>Es gibt noch keine Fahrzeuge</Typography>
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: '1.3rem' }}>Datum</TableCell>
                    <TableCell style={{ fontSize: '1.3rem' }}>
                      Kennzeichen
                    </TableCell>
                    <TableCell style={{ fontSize: '1.3rem' }}>
                      Name
                    </TableCell>
                    <TableCell style={{ fontSize: '1.3rem' }}>
                      Fahrzeug
                    </TableCell>
                    <TableCell style={{ fontSize: '1.3rem' }}>Bild</TableCell>
                    <TableCell style={{ fontSize: '1.3rem' }}>
                      Aktionen
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.marketplaceVehicles.map((veh) => (
                    <VehicleView {...props} vehicle={veh} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box
          style={{
            marginTop: 70,
          }}
        >
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize='1.7rem'>Hinzufügen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                style={{
                  padding: 9,
                }}
              >
                {vehiclesAvailable.length < 1 ? (
                  <Alert severity='warning'>
                    <Typography>
                      Deine Fahrzeuge sind entweder schon zum Verkauf gestellt,
                      oder du hast keine Fahrzeuge.
                    </Typography>
                  </Alert>
                ) : (
                  <FormControl fullWidth>
                    <InputLabel>Fahrzeug wählen</InputLabel>
                    <Select
                      disabled={disabled}
                      label='Fahrzeug wählen'
                      value={vehiclePlate}
                      onChange={(ev) => setVehiclePlate(ev.target.value as any)}
                    >
                      {vehiclesAvailable
                        .filter((veh) => {
                          const exists = props.marketplaceVehicles.find(
                            (v) => v.plate === veh.plate
                          )
                          return !exists
                        })
                        .map((veh) => (
                          <MenuItem
                            id={veh.plate}
                            key={veh.plate}
                            value={veh.plate}
                          >
                            {veh.name} (Kennzeichen: {veh.plate}){' '}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
                <Box
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {vehicle && vehiclePlate && vehicle.image && (
                    <>
                      <Image src={vehicle.image} height={400} width={800} />
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          disabled={disabled}
                          onClick={addVehicle}
                          variant='outlined'
                        >
                          Fahrzeug in den Markt aufnehmen
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>
    </Paper>
  )
}

export type VehicleViewProps = Props & { vehicle: MarketPlaceVehicle }

const VehicleView = (props: VehicleViewProps) => {
  const { created_at, id, image, model_name, owner, plate, vehicle } =
    props.vehicle

  const [receiverIdentifier, setReceiverIdentifier] = React.useState<
    null | string
  >(null)

  function sellVehicle() {

  }

  return (
    <TableRow key={plate}>
      <TableCell style={{ fontSize: '1.1rem' }}>
        {created_at.toDateString()}
      </TableCell>
      <TableCell style={{ fontSize: '1.1rem' }}>{plate}</TableCell>
      <TableCell style={{ fontSize: '1.1rem' }}>{JSON.parse(vehicle).name}</TableCell>
      <TableCell style={{ fontSize: '1.1rem' }}>{model_name}</TableCell>
      <TableCell style={{ fontSize: '1.1rem' }}>
        <Image src={image} height={150} width={300} />
      </TableCell>
      <TableCell style={{ fontSize: '1.1rem' }}>
        {owner === props.ownerIdentifier && (
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Button
              color='error'
              style={{
                marginTop: 25,
              }}
            >
              Verkauf stoppen
            </Button>
            <FormControl fullWidth>
              <InputLabel>Empfänger wählen</InputLabel>
              <Select
                label='Empfänger wählen'
                value={receiverIdentifier}
                onChange={(ev) => setReceiverIdentifier(ev.target.value as any)}
              >
                {props.players.map((player) => (
                  <MenuItem
                    id={player.identifier}
                    key={player.identifier}
                    value={player.identifier}
                  >
                    {player.first_name} {player.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={sellVehicle}
              style={{
                marginTop: 25,
              }}
            >
              Verkaufen an
            </Button>
          </Box>
        )}
      </TableCell>
    </TableRow>
  )
}


export const getServerSideProps: GetServerSideProps = withSessionSsr(
  {
    ensureAuthenticated: true,
  },
  async (ctx) => {
   
    const marketplaceVehicles = await prisma.web_vehicle_marketplace.findMany()
    const userVehicles = await prisma.owned_vehicles.findMany({
      where: {
        owner: ctx.req.session.user.identifier
      }
    })

    const players = await prisma.users.findMany({})

    return {
      props: {
        marketplaceVehicles,
        userVehicles,
        ownerIdentifier: ctx.req.session.user.identifier,
        players: players.map(p => ({
          first_name: p.firstname,
          last_name: p.lastname,
          identifier: p.identifier
        }))
      },
    }
  }
)
