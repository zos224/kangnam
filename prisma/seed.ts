import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      username: 'admin'
    }
  })

  if (!existingAdmin) {
    // Create admin account if it doesn't exist
    const hashedPassword = await bcrypt.hash('123456', 10)
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator'
      }
    })
    console.log('Admin account created successfully')
  } else {
    console.log('Admin account already exists')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })