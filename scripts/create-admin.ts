// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import readline from 'readline'
import { getId } from '@/lib/utils'

const prisma = new PrismaClient()

// Validation schema for admin user
const adminSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve)
    })
}

async function main() {
    try {
        console.log('Create Admin User')
        console.log('----------------')

        // Get user input
        const name = await question('Enter admin name: ')
        const email = await question('Enter admin email: ')
        const password = await question('Enter admin password: ')

        // Validate input
        const validatedData = adminSchema.parse({
            name,
            email,
            password,
        })

        // check if admin user already exists
        const existingAdmin = await prisma.user.findFirst({
            where: {
                email: validatedData.email,
            },
        })

        if (existingAdmin) {
            console.log('\nAdmin user already exists!')
            console.log('Email:', existingAdmin.email)
            console.log('Role:', existingAdmin.role)
            console.log('Login ID:', existingAdmin.loginId)
            return
        }

        // generate loginId for admin user
        const existingAdminCount = await prisma.user.count({
            where: {
                role: 'ADMIN',
            },
        })
        const loginId = getId('ADMIN', existingAdminCount)
        console.log('\nLogin ID:', loginId)

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        // Create admin user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                loginId,
                role: 'ADMIN',
            },
        })

        console.log('\nAdmin user created successfully!')
        console.log('Email:', user.email)
        console.log('Role:', user.role)
        console.log('Login ID:', user.loginId)

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('\nValidation error:')
            error.errors.forEach((err) => {
                console.error(`- ${err.message}`)
            })
        } else {
            console.error('\nError:', error)
        }
    } finally {
        await prisma.$disconnect()
        rl.close()
    }
}

main()
