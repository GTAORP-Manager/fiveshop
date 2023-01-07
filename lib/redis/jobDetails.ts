import { redis } from '@db'
import {
   job_grades as JobDetails
} from '@prisma/client'

export const exp = 60 * 60 * 48

export const getValue = async (jobName: string, jobGrade: number): Promise<JobDetails[]> => {
    const key = `properties.all`

    const cache = await redis.get(key)

    let rv: JobDetails[]

    if (cache) {
        rv = JSON.parse(cache)
    } else {
        // @ts-ignore
        rv = await prisma?.job_grades.findFirst({
            where: {
                job_name: jobName,
                grade: jobGrade
            }
        })

        await redis.setex(key, exp, JSON.stringify(rv))
    }

    return rv
}