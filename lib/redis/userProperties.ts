import { redis } from '@db'
import {
    owned_properties as OwnedProperty
} from '@prisma/client'

export const exp = 60 * 15

export const getValue = async (identifier: string): Promise<OwnedProperty[]> => {
    const key = `user.properties.${identifier}`

    const cache = await redis.get(key)

    let rv: OwnedProperty[]

    if (cache) {
        rv = JSON.parse(cache)
    } else {
        // @ts-ignore
        rv = await prisma?.owned_properties.findMany({
            where: {
                owner: identifier
            }
        })

        await redis.setex(key, exp, JSON.stringify(rv))
    }

    return rv
}