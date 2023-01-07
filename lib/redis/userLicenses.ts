import { redis } from '@db'
import {
    user_licenses as UserLicense
} from '@prisma/client'

export const exp = 60 * 5

export const getValue = async (identifier: string): Promise<UserLicense[]> => {
    const key = `user.licenses.${identifier}`

    const cache = await redis.get(key)

    let rv: UserLicense[]

    if (cache) {
        rv = JSON.parse(cache)
    } else {
        // @ts-ignore
        rv = await prisma?.user_licenses.findMany({
            where: {
                owner: identifier
            }
        })

        await redis.setex(key, exp, JSON.stringify(rv))
    }

    return rv
}