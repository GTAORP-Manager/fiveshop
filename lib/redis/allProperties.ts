import { redis } from '@db'
import {
    properties as Property
} from '@prisma/client'

export const exp = 60 * 60 * 48

export const getValue = async (): Promise<Property[]> => {
    const key = `properties.all`

    const cache = await redis.get(key)

    let rv: Property[]

    if (cache) {
        rv = JSON.parse(cache)
    } else {
        // @ts-ignore
        rv = await prisma?.properties.findMany()

        await redis.setex(key, exp, JSON.stringify(rv))
    }

    return rv
}