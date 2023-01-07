import React from 'react'
import { withSessionSsr } from '@auth'
import {
  User,
  UserLicense,
  UserOwnedVehicle,
  UserBill,
  UserBanking,
  UserOwnedProperty,
  JobDetail,
  Property,
} from '@db'
import Head from 'next/head';
import { useRouter } from 'next/router';
import moment from 'moment'
// @ts-ignore
import * as fivem from 'fivem-server'
import { Accordion,Tooltip, AccordionDetails, AccordionSummary, Alert, Box, Button, IconButton, List, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import PeopleIcon from '@mui/icons-material/People'
import NoCrashIcon from '@mui/icons-material/NoCrash';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import GarageIcon from '@mui/icons-material/Garage'
import HomeIcon from '@mui/icons-material/Home'
import DnsIcon from '@mui/icons-material/Dns'
import ExtensionIcon from '@mui/icons-material/Extension'
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import DevicesIcon from '@mui/icons-material/Devices'

import axios from 'axios';
import { getCFXStatus, CFXStatusData } from '@util/getCFXStatus'

import Money from '@components/Money'
import {
  appConfig
} from '@appConfig'
import {
  getUserLicenses,
  getUserOwnedVehicles,
  getUserBills,
  getUserBanking,
  getUserProperties,
  getAllProperties,
  getJobDetails,
  getUser,
} from '@lib/redis'

export interface Props {
  user: User
  jobDetails: JobDetail
  server?: any
  onlinePlayers?: any
  userLicenses: UserLicense[]
  userOwnedVehicles: UserOwnedVehicle[]
  userBills: UserBill[]
  userBanking: UserBanking[]
  userProperties: (UserOwnedProperty & { label: string })[]
  cfxStatus: CFXStatusData
}

const ResourceView = ({name, index, manageable}: { name: string, index: number, manageable?: boolean }) => {
  return (
    <TableRow key={`server-resources.${name}-${index}`}>
      <TableCell style={{ fontSize: '1.1rem' }}>{index + 1}</TableCell>
      <TableCell style={{ fontSize: '1.1rem' }}>{name}</TableCell>
      <TableCell style={{ fontSize: '1.1rem' }}>
        {manageable ? <Button disabled>Verwalten [WIP]</Button> : (
          <Typography>-- </Typography>
        )}
      </TableCell>
    </TableRow>
  )
 }
export default (props: Props) => {

  moment.locale('de')
  
  const router = useRouter()

  const user = props.user

  const { bank, money, black_money } = JSON.parse(user.accounts || '{}');

  const logout = () => {
    axios.post('/api/auth/logout').then(() => router.push('/'))
  }

  //console.log(props)

  return (
    <Paper
      style={{
        width: '100vw',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
      }}
    >
      <Head>
        <link rel='apple-touch-icon' sizes='180x180' href='/fiverp_dark.jpg' />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/fiverp_dark.jpg'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/fiverp_dark.jpg'
        />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
        <title>FiveM Dashboard</title>
      </Head>

      {/**
       * FiveM Status
       * Server Status & Data
       */}
      {appConfig.show_server_data === true && (
        <Paper
          elevation={3}
          style={{
            padding: 50,
            width: '75%',
            height: 'auto',
          }}
        >
          {props.cfxStatus.status.description !== 'All Systems Operational' && (
            <Box
              style={{
                marginBottom: 19,
              }}
            >
              <Alert severity='error'>
                <Typography>
                  Die FiveM Server (CFX) Server sind möglicherweise nicht
                  verfügbar.
                  <br />
                  Offizielle Info:{' '}
                  <Typography component='em'>
                    {props.cfxStatus.status.description}
                  </Typography>
                </Typography>
              </Alert>
            </Box>
          )}
          {props.server !== null ? (
            <Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        <DnsIcon fontSize='small' style={{ marginRight: 9 }} />
                        Severname
                      </TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        <VideogameAssetIcon
                          fontSize='small'
                          style={{ marginRight: 9 }}
                        />
                        Spiel
                      </TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        <BuildCircleIcon
                          fontSize='small'
                          style={{ marginRight: 9 }}
                        />
                        Gamebuild
                      </TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        <DevicesIcon
                          fontSize='small'
                          style={{ marginRight: 9 }}
                        />
                        Clients{' '}
                        {props.onlinePlayers.length >= 1
                          ? `(${props.onlinePlayers.length})`
                          : ''}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ fontSize: '1rem', color: '#917c8a' }}>
                        {props.server.vars.sv_projectName}
                      </TableCell>
                      <TableCell style={{ fontSize: '1rem', color: '#81917c' }}>
                        {props.server.vars.gamename}
                      </TableCell>
                      <TableCell style={{ fontSize: '1rem', color: '#678291' }}>
                        {props.server.vars.sv_enforceGameBuild}
                      </TableCell>
                      <TableCell style={{ fontSize: '1rem' }}>
                        <List>
                          {props.onlinePlayers.length < 1 ? (
                            <Typography color='#616362'>
                              Keine Benutzer verbunden
                            </Typography>
                          ) : (
                            props.onlinePlayers.map(
                              (player: any, idx: number) => (
                                <li key={player.id}>
                                  <Typography>
                                    ({idx + 1}) {player.name}, {player.ping}ms
                                  </Typography>
                                </li>
                              )
                            )
                          )}
                        </List>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {appConfig.show_server_resources === true && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontSize='1.4rem'>
                      <ExtensionIcon
                        fontSize='small'
                        style={{
                          marginRight: 9,
                        }}
                      />
                      Server-Resourcen
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontSize: '1rem' }}>
                              Position
                            </TableCell>
                            <TableCell style={{ fontSize: '1rem' }}>
                              Name
                            </TableCell>
                            <TableCell style={{ fontSize: '1rem' }}>
                              Aktionen
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {props.server.resources.map(
                            (name: string, idx: number) => (
                              <ResourceView
                                key={`resource.${name}`}
                                index={idx}
                                name={name}
                                manageable={
                                  appConfig.resources?.find(
                                    (r) => r.name === name
                                  ) != undefined
                                }
                              />
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          ) : (
            <Alert severity='error'>
              <Typography fontSize='1.2rem'>
                Der FiveM Server ist nicht erreichbar
              </Typography>
            </Alert>
          )}
        </Paper>
      )}

      {/**
       * My Account
       */}
      <Paper
        elevation={3}
        style={{
          padding: 50,
          marginTop: 50,
          width: '75%',
        }}
      >
        <Typography
          style={{
            marginBottom: 22,
          }}
          fontSize='2rem'
        >
          Deine Daten
        </Typography>

        <TableContainer component={Paper}>
          <Table aria-label='Konto'>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '1.3rem' }}>Vorname</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Nachname</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>
                  Geburtsdatum
                </TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Geschlecht</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Größe (cm)</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>
                  Beruf/Stufe
                </TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Bankkonto</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Bargeld</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>
                  Schwarzgeld
                </TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Gruppe</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Inventar</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Loadout</TableCell>
                <TableCell style={{ fontSize: '1.3rem' }}>Lizenzen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontSize: '1.1rem' }}>
                  {user.firstname}
                </TableCell>
                <TableCell style={{ fontSize: '1.1rem' }}>
                  {user.lastname}
                </TableCell>
                <TableCell style={{ fontSize: '1.1rem' }}>
                  {user.dateofbirth}
                </TableCell>
                <TableCell style={{ fontSize: '1.1rem' }}>
                  {user.sex === 'm'
                    ? 'Männlich'
                    : user.sex === 'f'
                    ? 'Weiblich'
                    : 'Sonstiges'}
                </TableCell>
                <TableCell style={{ fontSize: '1.1rem' }}>
                  {user.height}
                </TableCell>
                <TableCell style={{ fontSize: '1.1rem' }}>
                  {props.jobDetails.name != ''
                    ? `${props.jobDetails.name} / `
                    : ''}{' '}
                  {props.jobDetails.label}
                </TableCell>
                <TableCell style={{ fontSize: '1.1rem' }}>
                  <Money>{bank}</Money>
                </TableCell>
                <TableCell style={{ fontSize: '1.1rem' }}>
                  <Money>{money}</Money>
                </TableCell>
                <TableCell>
                  <Money>{black_money}</Money>
                </TableCell>
                <TableCell>{user.group}</TableCell>
                <TableCell>
                  <List>
                    {Object.entries(
                      JSON.parse(user.inventory || '{}') as object
                    ).map(([key, value]) => (
                      <li key={`inventory.${key}`}>
                        <Typography>
                          - {key}: {value}
                        </Typography>
                      </li>
                    ))}
                  </List>
                </TableCell>
                <TableCell>
                  <List>
                    {Object.entries(
                      JSON.parse(user.loadout || '{}') as object
                    ).map(([key, value]) => (
                      <li key={`weapon.${key}`}>
                        <Typography fontSize='0.8rem'>
                          - {key} ({value.ammo}x)
                        </Typography>
                      </li>
                    ))}
                  </List>
                </TableCell>
                <TableCell>
                  <List>
                    {props.userLicenses.map((license, idx) => (
                      <li key={`license.${license.id}`}>
                        <Typography>- {license.type}</Typography>
                      </li>
                    ))}
                  </List>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/**
       * Vehicles
       * Bills
       * Banking
       */}
      <Paper
        elevation={3}
        style={{
          padding: 50,
          width: '75%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {props.userOwnedVehicles.length >= 1 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize='2rem'>
                <GarageIcon
                  style={{
                    marginRight: 9,
                  }}
                />
                Angemeldete Fahrzeuge ({props.userOwnedVehicles.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        Position
                      </TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        Kennzeichen
                      </TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>Typ</TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>Job</TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        Tankstand (%)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.userOwnedVehicles.map((ov, idx) => {
                      const details = JSON.parse(ov.vehicle || '{}')
                      return (
                        <TableRow
                          key={`owned-vehicle.${ov.plate.replace(' ', '-')}`}
                        >
                          <TableCell style={{ fontSize: '1.1rem' }}>
                            {idx + 1}
                          </TableCell>
                          <TableCell
                            style={{ fontSize: '1.1rem', color: '#71848a' }}
                          >
                            {ov.plate}
                          </TableCell>
                          <TableCell
                            style={{ fontSize: '1.1rem', color: '#8d8899' }}
                          >
                            {ov.type}
                          </TableCell>
                          <TableCell
                            style={{ fontSize: '1.1rem', color: '#918f79' }}
                          >
                            {ov.job}
                          </TableCell>
                          <TableCell
                            style={{ fontSize: '1.1rem', color: '#d6ca98' }}
                          >
                            {details.fuelLevel}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {props.userBills.length >= 1 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize='2rem'>
                <LocalAtmIcon
                  style={{
                    marginRight: 9,
                  }}
                />
                Rechungen ({props.userBills.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity='warning'>
                <Typography>
                  Die Rechnungen können im Spiel über das "F5"-Menü bezahlt
                  werden. Nicht bezahlte Rechnungen können von der Polizei
                  eingesehen werden.
                </Typography>
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: '1.2rem' }}>
                        Betrag
                      </TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>
                        Hinweis
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.userBills.map((bill) => {
                      return (
                        <TableRow key={`bill.${bill.id}`}>
                          <TableCell
                            style={{ fontSize: '1.1rem', color: '#d1caae' }}
                          >
                            <Money>{bill.amount}</Money>
                          </TableCell>
                          <TableCell style={{ fontSize: '1.1rem' }}>
                            {bill.label}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {props.userBanking.length >= 1 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize='2rem'>
                <AccountBalanceIcon
                  style={{
                    marginRight: 9,
                  }}
                />
                Banking ({props.userBanking.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: '1.3rem' }}>Typ</TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        Betrag ($)
                      </TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        Zeitstempel
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.userBanking.map((transaction) => {
                      return (
                        <TableRow key={`transaction.${transaction.id}`}>
                          <TableCell style={{ fontSize: '1.1rem' }}>
                            {transaction.type === 'withdraw'
                              ? 'Geld abgehoben'
                              : 'Geld eingezahlt'}
                          </TableCell>
                          <TableCell style={{ fontSize: '1.1rem' }}>
                            <Money>40</Money>
                          </TableCell>
                          <TableCell style={{ fontSize: '1.1rem' }}>
                            {/*{moment(new Date(transaction.time || '')).format(
                              'MMMM DD, h:mm'
                            )}{' '}*/}{' '}
                            -
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {props.userProperties.length >= 1 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize='2rem'>
                <HomeIcon
                  style={{
                    marginRight: 9,
                  }}
                />
                Häuser ({props.userProperties.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: '1.3rem' }}>Name</TableCell>
                      <TableCell style={{ fontSize: '1.3rem' }}>
                        Betrag ($)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.userProperties.map((property) => {
                      return (
                        <TableRow key={`property.${property.id}`}>
                          <TableCell style={{ fontSize: '1.1rem' }}>
                            {property.label}
                          </TableCell>
                          <TableCell style={{ fontSize: '1.1rem' }}>
                            <Money>{property.price}</Money>{' '}
                            {property.rented && `Miete, pro Woche`}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}
      </Paper>

      {/**
       * Navigation
       */}
      <Paper
        elevation={3}
        style={{
          width: '75%',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <Box
          style={{
            padding: 50,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <Button color='error' onClick={logout}>
            <Typography fontSize='0.8rem'>Abmelden</Typography>
          </Button>
        </Box>
        <Box
          style={{
            padding: 50,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <Tooltip title='txAdmin'>
            <IconButton
              onClick={() =>
                router.push(process.env.NEXT_PUBLIC_TXADMIN || 'about:blank')
              }
              //target='_blank'
              color='primary'
              aria-label='txAdmin'
              component='label'
            >
              <SettingsApplicationsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Benutzerliste'>
            <IconButton
              onClick={() => router.push('/dashboard/users')}
              color='primary'
              aria-label='Fahrzeug kaufen'
              component='label'
            >
              <PeopleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Fahrzeughandel'>
            <IconButton
              disabled
              onClick={() =>
                router.push('/dashboard/commercial/vehicle-marketplace')
              }
              color='primary'
              aria-label='Fahrzeug kaufen'
              component='label'
            >
              <NoCrashIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Online Shop'>
            <IconButton
              onClick={() => router.push('/dashboard/commercial')}
              color='primary'
              aria-label='Fahrzeug kaufen'
              component='label'
            >
              <LocalGroceryStoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/**
       * Footer
       */}
      <Paper
        elevation={3}
        style={{
          padding: 50,
          display: 'flex',
          marginTop: 50,
          width: '75%',
        }}
      >
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography color='#515251'>Fiveshop 2022</Typography>
          <Typography color='#515251'>FiveRP</Typography>
        </Box>
      </Paper>
    </Paper>
  )
}

export const getServerSideProps = withSessionSsr(
  {
    ensureAuthenticated: true,
  },
  async (ctx) => {
    
    /**
     * Retrieve server details
     */
    
    let server: any = null, serverData: any = null, onlinePlayers = []
    
    try {
      server = new fivem("gm.trebossa.me:30121");

      serverData = await server.getAllInfo()
      onlinePlayers = await server.getPlayers()

    } catch(err) {
      server = null
    }

    // User fivem-unique identifier
    const identifier = ctx.req.session.user.identifier

    const user = await getUser.getValue(identifier)

    if (!user || user === null)
      return {
        redirect: {
          destination: '/',
          permanent: false,
          statusCode: 403
        }
      }

    const userLicenses = await getUserLicenses.getValue(identifier)
    const userOwnedVehicles = await getUserOwnedVehicles.getValue(identifier)
    const userBills = await getUserBills.getValue(identifier)
    const userBanking =await getUserBanking.getValue(identifier)
    const userProperties = await getUserProperties.getValue(identifier)

    const properties = await getAllProperties.getValue()

    const jobDetails = await getJobDetails.getValue(user.job || '', user.job_grade || 0)

    const cfxStatus = await getCFXStatus()
      
    return {
      props: {
        user,
        jobDetails,
        server: serverData,
        onlinePlayers,
        userLicenses,
        userOwnedVehicles,
        userBills,
        userBanking,
        userProperties: userProperties.map((p) => ({
          ...p,
          label: properties.find((p2) => p2.name === p.name)?.label,
        })),

        cfxStatus,
      },
    }
  }
);
