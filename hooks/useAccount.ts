import { User } from '@db'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'

export interface UseAccountOptions {
    delay_sync?: number
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

export default (options: UseAccountOptions) => {

    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [user, setUser] = React.useState<User |undefined>()

    React.useEffect(() => {
        sync()
    }, [])

    const sync = React.useCallback(async() => {
        setLoading(true)
        
        if (options?.delay_sync) await sleep(options.delay_sync)

        const resp = await axios.get(`/api/auth/account`)
        if (resp.status !== 200) {
            setLoading(false)
            return await router.push('/')
        }

        const user = resp.data.user as User
        setUser(user)

        setLoading(false)
    }, [])

    return {
        user,
        sync,
        loading
    }
}