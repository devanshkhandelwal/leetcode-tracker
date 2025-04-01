const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const { Prisma } = require('@prisma/client');

const app = express();
const port = 3000;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Endpoints
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/report', async (req, res) => {
    const { difficulty, category, reviewStatus, startDate, endDate } = req.body;
    
    try {
        // Using prepared statements for complex report queries
        const problems = await prisma.$queryRaw`
            SELECT p.*, c.name as category_name, 
                   COUNT(sh.id) as review_count,
                   MAX(sh.study_date) as last_reviewed
            FROM problems p
            LEFT JOIN categories c ON p.category_name = c.name
            LEFT JOIN study_history sh ON p.id = sh.problem_id
            WHERE 1=1
            ${difficulty ? Prisma.sql`AND p.difficulty = ${difficulty}` : Prisma.empty}
            ${category ? Prisma.sql`AND c.name = ${category}` : Prisma.empty}
            ${reviewStatus ? Prisma.sql`AND sh.review_status = ${reviewStatus}` : Prisma.empty}
            ${startDate ? Prisma.sql`AND sh.study_date >= ${new Date(startDate)}` : Prisma.empty}
            ${endDate ? Prisma.sql`AND sh.study_date <= ${new Date(endDate)}` : Prisma.empty}
            GROUP BY p.id, c.name
            ORDER BY p.title ASC
        `;

        // Using prepared statement for statistics
        const stats = await prisma.$queryRaw`
            SELECT 
                COUNT(*) as total_problems,
                AVG(sh.review_count) as avg_review_count,
                COUNT(CASE WHEN sh.review_status = 'Mastered' THEN 1 END) as mastered_count,
                COUNT(CASE WHEN sh.next_review_date <= CURRENT_TIMESTAMP THEN 1 END) as next_review_due
            FROM problems p
            LEFT JOIN study_history sh ON p.id = sh.problem_id
            WHERE 1=1
            ${difficulty ? Prisma.sql`AND p.difficulty = ${difficulty}` : Prisma.empty}
            ${category ? Prisma.sql`AND p.category_name = ${category}` : Prisma.empty}
        `;

        res.json({
            problems,
            totalProblems: stats[0].total_problems,
            avgReviewCount: stats[0].avg_review_count || 0,
            masteryRate: (stats[0].mastered_count / stats[0].total_problems) * 100,
            nextReviewDue: stats[0].next_review_due
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the report page
app.get('/report', (req, res) => {
    res.sendFile(path.join(__dirname, 'report.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 