import { redis } from '@db'
import {
    billing as UserBills
} from '@prisma/client'

export const exp = 60 * 5

export const getValue = async (identifier: string): Promise<UserBills[]> => {
    const key = `user.bills.${identifier}`

    const cache = await redis.get(key)

    let rv: UserBills[]

    if (cache) {
        rv = JSON.parse(cache)
    } else {
        // @ts-ignore
        rv = await prisma?.billing.findMany({
            where: {
                identifier
            }
        })

        await redis.setex(key, exp, JSON.stringify(rv))
    }

    return rv
}