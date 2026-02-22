import { PrismaClient } from '@prisma/client'

const getPrismaClient = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof getPrismaClient>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
