const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Querying companies...');
    const companies = await prisma.company.findMany({
        select: {
            id: true,
            name: true,
            domainSlug: true
        }
    });

    console.log('--- Database Companies ---');
    console.log(JSON.stringify(companies, null, 2));
    console.log('--------------------------');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
