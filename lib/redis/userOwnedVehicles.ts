import {redis} from '@db'
import {
    owned_vehicles as OwnedVehicle
} from '@prisma/client'

export const exp = 60 * 5

export const getValue = async (identifier: string): Promise<OwnedVehicle[]> => {
    const key = `user.vehicles.${identifier}`

    const cache = await redis.get(key)

    let rv: OwnedVehicle[]

    if (cache) {
        rv = JSON.parse(cache)
    } else {
        // @ts-ignore
        rv = await prisma?.owned_vehicles.findMany({
            where: {
                owner: identifier
            }
        })

        await redis.setex(key, exp, JSON.stringify(rv))
    }

    return rv
}