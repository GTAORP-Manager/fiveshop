import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import * as dbTypes from '@prisma/client'

/**
 * MySQL DB
 */
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export type User = dbTypes.users
export type Property = dbTypes.properties
export type JobDetail = dbTypes.job_grades
export type UserBanking = dbTypes.banking
export type UserBill = dbTypes.billing
export type UserLicense = dbTypes.user_licenses
export type UserOwnedVehicle = dbTypes.owned_vehicles
export type UserOwnedProperty = dbTypes.owned_properties



/**
 * Redis DB
 */
export const redis = new Redis({
  db: Number(process.env.REDIS_DB_NAME) || undefined,
  port: Number(process.env.REDIS_PORT) || undefined,
  host: process.env.REDIS_HOST || undefined,
})