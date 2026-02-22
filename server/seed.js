const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.company.deleteMany({});

    // Create a default tenant for local testing
    const company = await prisma.company.create({
        data: {
            name: 'Exact Rent Car (Agdal)',
            adminUser: 'admin',
            domainSlug: 'localhost', // Mapped to localhost for easy local testing
            settings: {
                create: {
                    primaryColor: '#dc2626',
                    secondaryColor: '#18181b',
                    logoUrl: '/Logo.png',
                    aboutText: 'Bienvenue chez Exact Rent Car, votre partenaire de confiance pour la location de véhicules premium et confortables de Rabat Agdal.',
                    contactEmail: 'contact@exactrentcar.com',
                    contactPhone: '+212 600 000 000',
                    address: 'Rabat Agdal, Maroc'
                }
            },
            cars: {
                create: [
                    { model: 'Dacia Logan', pricePerDay: 250, category: 'BUDGET', image: '/uploads/cars/dacia.jpg' },
                    { model: 'Renault Clio 5', pricePerDay: 300, category: 'CONFORT', image: '/uploads/cars/clio.jpg' },
                    { model: 'Hyundai Tucson', pricePerDay: 600, category: 'LUX', image: '/uploads/cars/tucson.jpg' }
                ]
            }
        },
        include: { settings: true, cars: true }
    });

    console.log('Successfully seeded multi-tenant database!');
    console.log('Demo Company:', company.name, '| Slug:', company.domainSlug);
    console.log('Cars created:', company.cars.length);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
