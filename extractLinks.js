const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('https://neetcode.io/practice?tab=neetcode150', { waitUntil: 'networkidle2' });

    // Scroll down to ensure all links load
    await page.evaluate(async () => {
        await new Promise(resolve => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });

    // Pause to let JavaScript-rendered elements load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract problem information including difficulty and category
    const problems = await page.evaluate(() => {
        const problemElements = document.querySelectorAll('tbody tr');
        return Array.from(problemElements).map(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 5) return null;
            
            // Get the problem title and LeetCode link from the third cell
            const titleCell = cells[2];
            const titleLink = titleCell.querySelector('a.table-text');
            const leetcodeLink = titleCell.querySelector('a[target="_blank"]');
            
            if (!titleLink || !leetcodeLink) return null;
            
            // Get difficulty from the fourth cell
            const difficultyCell = cells[3];
            const difficultyButton = difficultyCell.querySelector('button');
            const difficulty = difficultyButton ? difficultyButton.textContent.trim() : 'Unknown';
            
            return {
                title: titleLink.textContent.trim(),
                neetcodeLink: titleLink.href,
                leetcodeLink: leetcodeLink.href,
                difficulty: difficulty
            };
        }).filter(problem => problem && problem.leetcodeLink.startsWith('https://leetcode.com/problems/'));
    });

    // Save to problems.json
    fs.writeFileSync('problems.json', JSON.stringify(problems, null, 2));
    console.log('Problems data saved to problems.json');

    await browser.close();
})();
