const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupDatabase() {
    try {
        // Insert default categories
        const categories = [
            'Arrays & Hashing',
            'Two Pointers',
            'Sliding Window',
            'Stack',
            'Binary Search',
            'Linked List',
            'Trees',
            'Tries',
            'Heap / Priority Queue',
            'Backtracking',
            'Graphs',
            'Advanced Graphs',
            '1-D Dynamic Programming',
            '2-D Dynamic Programming',
            'Greedy',
            'Intervals',
            'Math & Logic',
            'Bit Manipulation'
        ];

        for (const category of categories) {
            await prisma.category.upsert({
                where: { name: category },
                update: {},
                create: { name: category }
            });
        }
        console.log('Inserted default categories');

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

setupDatabase(); 