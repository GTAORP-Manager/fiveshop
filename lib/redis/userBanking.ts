import { redis } from '@db'
import {
    banking as UserBanking
} from '@prisma/client'

export const exp = 60 * 5

export const getValue = async (identifier: string): Promise<UserBanking[]> => {
    const key = `user.banking.${identifier}`

    const cache = await redis.get(key)

    let rv: UserBanking[]

    if (cache) {
        rv = JSON.parse(cache)
    } else {
        // @ts-ignore
        rv = await prisma?.banking.findMany({
            where: {
                identifier
            }
        })

        await redis.setex(key, exp, JSON.stringify(rv))
    }

    return rv
}