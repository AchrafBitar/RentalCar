const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const company = await prisma.company.create({
        data: {
            name: 'ExactRentCar',
            adminUser: 'admin',
        },
    });
    console.log('Created company:', company);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
