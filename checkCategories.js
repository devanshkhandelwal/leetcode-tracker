const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
    try {
        const categories = await prisma.category.findMany();
        console.log('Categories in database:');
        categories.forEach(cat => console.log(cat.name));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCategories(); 