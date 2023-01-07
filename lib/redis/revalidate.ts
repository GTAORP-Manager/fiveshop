import {redis} from '@db'

export const revalidate = async(key: string) => await redis.del(key)
