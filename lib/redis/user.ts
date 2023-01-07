import { redis } from '@db'
import {
    users as User
} from '@prisma/client'

export const exp = 60 * 1

export const getValue = async (identifier: string): Promise<User> => {
    const key = `user.${identifier}`

    const cache = await redis.get(key)

    let rv: User

    if (cache) {
        rv = JSON.parse(cache)
    } else {
        // @ts-ignore
        rv = await prisma?.users.findFirst({
            where: {
                identifier
            }
        })

        await redis.setex(key, exp, JSON.stringify(rv))
    }

    return rv
}