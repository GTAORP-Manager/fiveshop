import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useId } from "react";
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { withSessionSsr } from '@auth'
import Site from '@components/Site'

export interface LocalUser {
  fullName: string
  password?: string
  id: number
}

export const localUsersKey = 'localusers'

export default function Login() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<null | string>(null);
  const [error, setError] = React.useState<null | string>(null);

  const usernameId = useId();
  const passwordId = useId();

  const [fullName, setFullName] = React.useState('')
  const [password, setPassword] = React.useState("");

  const handleLogin = React.useCallback(
    async (ev?: any) => {
      ev?.preventDefault()

      if (
        fullName.length === 0 ||
        !fullName ||
        password.length === 0 ||
        !password
      )
        return setError('Ungültige Eingabe')

      setLoading(true)

      try {
        const [firstname, lastname] = fullName.split(' ')

        const resp = await axios.post(`/api/auth/login`, {
          firstname,
          lastname,
          password,
        })

        if (resp.status === 200) {
          setMessage('Anmeldung erfolgreich, bitte warten...')
          console.log('Anmeldung erfolgreich, bitte warten...')
          await router.push('/dashboard')
          console.log('Weiterleitung aktiv...')
          return
        }
      } catch (err) {
        setLoading(false)
        setError('Deine Anmeldedaten sind falsch')
      }
    },
    [fullName, password]
  )

  React.useEffect(() => setMessage(null), [fullName, password])
  
  const [localUsers, setLocalUsers] = React.useState<LocalUser[]>([])

  React.useEffect(() => {
    
    try {

      const storedUsers = JSON.parse(
        window.localStorage.getItem(localUsersKey) || '[]'
      ) as LocalUser[]

      console.log('Loading local users')

      setLocalUsers(storedUsers)

    } catch(err) {
      window.localStorage.setItem(localUsersKey, JSON.stringify('[]'))
      setLocalUsers([])
    }

  }, [])

  const addLocalUser = React.useCallback(() => {
    const newValue = [
      ...localUsers,
      {
        fullName,
        password,
        id:
          localUsers.length < 1 ? 1 : localUsers[localUsers.length - 1].id + 1,
      },
    ]
    setLocalUsers(newValue)

    window.localStorage.setItem(localUsersKey, JSON.stringify(newValue))
  }, [fullName, password, localUsers])

  const removeLocalUser = React.useCallback(() => {
    const newValue = localUsers.filter(e => e.fullName === fullName)
    setLocalUsers(newValue)
    window.localStorage.setItem(localUsersKey, JSON.stringify(newValue))
  }, [localUsers])

  const loginLocalUser = React.useCallback((id: number) => {

    if (id === -1) {
      setFullName('')
      setPassword('')
      return
    }

    const localUser = localUsers.find(l => l.id === id)
    if (!localUser) return
    setFullName(localUser.fullName)
    setPassword(localUser.password || '')
    /// handleLogin()
  }, [localUsers])
  

  return (
    <Site noDisplayElevation noHeader noFooter>
      <Head>
        <title>Anmeldung</title>
      </Head>
      <Box
        style={{
          width: '50%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          margin={5}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 30,
          }}
        >
          <Typography fontSize='2.4rem'>Fiveshop Anmeldung</Typography>
        </Box>

        <Box
          component='form'
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {localUsers.length > 0 && (
            <Box
              style={{
                width: '45%',
              }}
            >
              <FormControl fullWidth>
                <InputLabel>--</InputLabel>
                <Select
                  disabled={localUsers.length < 1}
                  label='Gespeicherte Benutzer'
                  value={undefined}
                  onChange={(ev) => loginLocalUser(Number(ev.target.value))}
                >
                  <MenuItem value={-1}>Gespeicherte Konten</MenuItem>
                  {localUsers.map((user, idx) => (
                    <MenuItem key={`user.${user.id}`} value={user.id}>
                      ({idx + 1}) {user.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          <Box
            style={{
              width: '45%',
            }}
          >
            <TextField
              fullWidth
              disabled={loading}
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              type='text'
              id={usernameId}
              label='Vorname Nachname'
            />
          </Box>

          <Box
            style={{
              width: '45%',
            }}
          >
            <TextField
              fullWidth
              disabled={loading}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              type='password'
              id={passwordId}
              label='Passwort'
            />
          </Box>

          <Box
            style={{
              width: '50%',
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 30,
            }}
          >
            <Button
              variant='outlined'
              type='submit'
              onClick={handleLogin}
              disabled={loading}
            >
              Anmelden
            </Button>
            <Box>
              <Button
                disabled={fullName.length < 1 || password.length < 1 || loading}
                variant='text'
                onClick={addLocalUser}
              >
                Konto sichern
              </Button>

              <Button color='error' disabled={loading || !fullName || !password} onClick={removeLocalUser}>Konto entfernen</Button>
            </Box>
          </Box>
        </Box>

        <Box>
          {message && (
            <Alert severity='info' style={{ marginTop: 12 }}>
              <Typography>{message}</Typography>
            </Alert>
          )}
          {error && (
            <Alert severity='error' style={{ marginTop: 12 }}>
              <Typography>{error}</Typography>
            </Alert>
          )}
        </Box>
      </Box>
    </Site>
  )
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  {},
  async (ctx) => {
    // @ts-ignore
    const isLoggedIn = ctx.req.session.user != null

    if (isLoggedIn)
      return {
        redirect: {
          permanent: false,
          destination: "/dashboard",
        },
      };

    return {
      props: {},
    };
  }
);
