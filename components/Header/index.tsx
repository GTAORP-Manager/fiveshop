import { Box, Tooltip, IconButton, Button, Typography, Paper, ListItem, ListItemAvatar, Avatar, ListItemText, Backdrop, CircularProgress, Skeleton } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import Dialog from '@components/dialog'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import PeopleIcon from '@mui/icons-material/People'
import NoCrashIcon from '@mui/icons-material/NoCrash'
import axios from 'axios'
import { LocalUser, localUsersKey } from 'pages/index'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import DashboardIcon from '@mui/icons-material/Dashboard';
import useAccount from 'hooks/useAccount'

export default function Header() {

  const router = useRouter()

  const [localUsers, setLocalUsers] = React.useState<LocalUser[]>([])
  const [switchAccountDialogOpen, setSwitchAccountDialogOpen] = React.useState(false)
  const [showBackdrop, setShowBackdrop] = React.useState(false)

  const account = useAccount({
    delay_sync: 800
  })

  const logout = () => axios.post('/api/auth/logout').then(() => router.push('/'))

  const switchAccount = React.useCallback(async(id: number) => {
    const user = localUsers.find(u => u.id === id)

    if (!user) return setSwitchAccountDialogOpen(false)

    setShowBackdrop(true)
    await new Promise((res) => setTimeout(res, 1000))
    await axios.post('/api/auth/logout')

    const [firstname, lastname] = user.fullName.split(' ')

    await axios.post('/api/auth/login', {
      firstname,
      lastname,
      password: user.password
    })

    router.reload()
  },[localUsers])

  React.useEffect(() => {
    try {
      const users = JSON.parse(window.localStorage.getItem(localUsersKey) || '[]') as LocalUser[]
      setLocalUsers(users)
    } catch(err) {
      window.localStorage.setItem(localUsersKey, JSON.stringify([]))
    }
  }, [])

  return (
    <Box
      style={{
        width: '100%',
        //position: 'absolute',
        height: '5%',
        //top: 0,
      }}
    >
      {account.user && (
        <Dialog
          onClose={() => setSwitchAccountDialogOpen(false)}
          open={switchAccountDialogOpen}
          component={(data: LocalUser) => (
            <ListItem
              button
              onClick={() => switchAccount(data.id)}
              key={`switch-account.${data.id}`}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'grey', color: 'white' }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={data.fullName} />
            </ListItem>
          )}
          data={localUsers.filter((localUser) => {
            const fullName = `${account.user?.firstname} ${account.user?.lastname}`
            if (localUser.fullName === fullName) return false
            return true
          })}
        />
      )}

      <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={showBackdrop}>
        <CircularProgress color='inherit' />
      </Backdrop>

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
      <Paper
        elevation={5}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          style={{
            width: '35%',
            padding: 20,
          }}
        >
          <Typography fontSize='1.35rem'>FiveShop</Typography>
        </Box>
        <Box
          style={{
            width: '30%',
            display: 'flex',
            gap: 5,
            justifyContent: 'center',
          }}
        >
          <Tooltip title='Dashboard'>
            <IconButton
              onClick={() => router.push('/dashboard')}
              //target='_blank'
              color='primary'
              aria-label='Dashboard'
              component='label'
            >
              <DashboardIcon />
            </IconButton>
          </Tooltip>

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

        <Box
          style={{
            width: '35%',
            display: 'flex',
            justifyContent: 'right',
            alignItems: 'center',
            padding: 20,
            gap: 20,
          }}
        >
          {account.loading && !account.user ? (
            <Skeleton variant='text' sx={{ fontSize: '2rem', width: '20%' }} />
          ) : (
            <Typography
              fontSize='1.1rem'
              style={{
                verticalAlign: 'middle',
                height: '10%',
              }}
            >
              {account.user?.firstname} {account.user?.lastname}
            </Typography>
          )}

          <Tooltip title='Konto wechseln'>
            <IconButton
              onClick={() => setSwitchAccountDialogOpen(true)}
              color='primary'
              aria-label='Konto wechseln'
              component='label'
            >
              <SwitchAccountIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Abmelden'>
            <IconButton
              onClick={logout}
              color='error'
              aria-label='Abmelden'
              component='label'
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  )
}
