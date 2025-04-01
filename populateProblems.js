const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

// Read problems from JSON file
const problemsData = JSON.parse(fs.readFileSync('problems.json', 'utf8'));

// Define problem categories mapping
const problemCategories = {
    // Arrays & Hashing
    "Contains Duplicate": "Arrays & Hashing",
    "Valid Anagram": "Arrays & Hashing",
    "Two Sum": "Arrays & Hashing",
    "Group Anagrams": "Arrays & Hashing",
    "Top K Frequent Elements": "Arrays & Hashing",
    "Product of Array Except Self": "Arrays & Hashing",
    "Valid Sudoku": "Arrays & Hashing",
    "Encode and Decode Strings": "Arrays & Hashing",
    "Longest Consecutive Sequence": "Arrays & Hashing",

    // Two Pointers
    "Valid Palindrome": "Two Pointers",
    "Two Sum II Input Array Is Sorted": "Two Pointers",
    "Two Sum II - Input Array Is Sorted": "Two Pointers",
    "3Sum": "Two Pointers",
    "Container With Most Water": "Two Pointers",
    "Trapping Rain Water": "Two Pointers",

    // Sliding Window
    "Best Time to Buy and Sell Stock": "Sliding Window",
    "Best Time to Buy And Sell Stock": "Sliding Window",
    "Longest Substring Without Repeating Characters": "Sliding Window",
    "Longest Repeating Character Replacement": "Sliding Window",
    "Permutation In String": "Sliding Window",
    "Minimum Window Substring": "Sliding Window",
    "Sliding Window Maximum": "Sliding Window",

    // Stack
    "Valid Parentheses": "Stack",
    "Min Stack": "Stack",
    "Evaluate Reverse Polish Notation": "Stack",
    "Generate Parentheses": "Stack",
    "Daily Temperatures": "Stack",
    "Car Fleet": "Stack",
    "Largest Rectangle In Histogram": "Stack",

    // Binary Search
    "Binary Search": "Binary Search",
    "Search a 2D Matrix": "Binary Search",
    "Koko Eating Bananas": "Binary Search",
    "Find Minimum in Rotated Sorted Array": "Binary Search",
    "Find Minimum In Rotated Sorted Array": "Binary Search",
    "Search in Rotated Sorted Array": "Binary Search",
    "Search In Rotated Sorted Array": "Binary Search",
    "Time Based Key Value Store": "Binary Search",
    "Time Based Key-Value Store": "Binary Search",
    "Median of Two Sorted Arrays": "Binary Search",

    // Linked List
    "Reverse Linked List": "Linked List",
    "Merge Two Sorted Lists": "Linked List",
    "Reorder List": "Linked List",
    "Remove Nth Node From End of List": "Linked List",
    "Copy List with Random Pointer": "Linked List",
    "Copy List With Random Pointer": "Linked List",
    "Add Two Numbers": "Linked List",
    "Linked List Cycle": "Linked List",
    "Find the Duplicate Number": "Linked List",
    "Find The Duplicate Number": "Linked List",
    "LRU Cache": "Linked List",
    "Merge K Sorted Lists": "Linked List",
    "Reverse Nodes in K-Group": "Linked List",
    "Reverse Nodes In K Group": "Linked List",

    // Trees
    "Invert Binary Tree": "Trees",
    "Maximum Depth of Binary Tree": "Trees",
    "Diameter of Binary Tree": "Trees",
    "Balanced Binary Tree": "Trees",
    "Same Tree": "Trees",
    "Subtree of Another Tree": "Trees",
    "Lowest Common Ancestor of a Binary Search Tree": "Trees",
    "Binary Tree Level Order Traversal": "Trees",
    "Binary Tree Right Side View": "Trees",
    "Count Good Nodes In Binary Tree": "Trees",
    "Validate Binary Search Tree": "Trees",
    "Kth Smallest Element In a Bst": "Trees",
    "Construct Binary Tree From Preorder And Inorder Traversal": "Trees",
    "Binary Tree Maximum Path Sum": "Trees",
    "Serialize And Deserialize Binary Tree": "Trees",

    // Tries
    "Implement Trie Prefix Tree": "Tries",
    "Design Add And Search Words Data Structure": "Tries",
    "Word Search II": "Tries",

    // Heap / Priority Queue
    "Kth Largest Element In a Stream": "Heap / Priority Queue",
    "Last Stone Weight": "Heap / Priority Queue",
    "K Closest Points to Origin": "Heap / Priority Queue",
    "Kth Largest Element In An Array": "Heap / Priority Queue",
    "Task Scheduler": "Heap / Priority Queue",
    "Design Twitter": "Heap / Priority Queue",
    "Find Median from Data Stream": "Heap / Priority Queue",
    "Find Median From Data Stream": "Heap / Priority Queue",

    // Backtracking
    "Subsets": "Backtracking",
    "Combination Sum": "Backtracking",
    "Permutations": "Backtracking",
    "Subsets II": "Backtracking",
    "Combination Sum II": "Backtracking",
    "Word Search": "Backtracking",
    "Palindrome Partitioning": "Backtracking",
    "Letter Combinations of a Phone Number": "Backtracking",
    "N Queens": "Backtracking",

    // Graphs
    "Number of Islands": "Graphs",
    "Clone Graph": "Graphs",
    "Max Area of Island": "Graphs",
    "Pacific Atlantic Water Flow": "Graphs",
    "Surrounded Regions": "Graphs",
    "Rotting Oranges": "Graphs",
    "Walls And Gates": "Graphs",
    "Course Schedule": "Graphs",
    "Course Schedule II": "Graphs",
    "Number of Connected Components In An Undirected Graph": "Graphs",
    "Graph Valid Tree": "Graphs",
    "Redundant Connection": "Graphs",

    // Advanced Graphs
    "Word Ladder": "Advanced Graphs",
    "Reconstruct Itinerary": "Advanced Graphs",
    "Min Cost to Connect All Points": "Advanced Graphs",
    "Network Delay Time": "Advanced Graphs",
    "Swim In Rising Water": "Advanced Graphs",
    "Alien Dictionary": "Advanced Graphs",
    "Cheapest Flights Within K Stops": "Advanced Graphs",

    // 1-D Dynamic Programming
    "Climbing Stairs": "1-D Dynamic Programming",
    "Min Cost Climbing Stairs": "1-D Dynamic Programming",
    "House Robber": "1-D Dynamic Programming",
    "House Robber II": "1-D Dynamic Programming",
    "Longest Palindromic Substring": "1-D Dynamic Programming",
    "Palindromic Substrings": "1-D Dynamic Programming",
    "Decode Ways": "1-D Dynamic Programming",
    "Coin Change": "1-D Dynamic Programming",
    "Maximum Product Subarray": "1-D Dynamic Programming",
    "Word Break": "1-D Dynamic Programming",
    "Longest Increasing Subsequence": "1-D Dynamic Programming",
    "Partition Equal Subset Sum": "1-D Dynamic Programming",

    // 2-D Dynamic Programming
    "Unique Paths": "2-D Dynamic Programming",
    "Longest Common Subsequence": "2-D Dynamic Programming",
    "Best Time to Buy And Sell Stock With Cooldown": "2-D Dynamic Programming",
    "Coin Change II": "2-D Dynamic Programming",
    "Target Sum": "2-D Dynamic Programming",
    "Interleaving String": "2-D Dynamic Programming",
    "Longest Increasing Path In a Matrix": "2-D Dynamic Programming",
    "Distinct Subsequences": "2-D Dynamic Programming",
    "Edit Distance": "2-D Dynamic Programming",
    "Burst Balloons": "2-D Dynamic Programming",
    "Regular Expression Matching": "2-D Dynamic Programming",

    // Greedy
    "Maximum Subarray": "Greedy",
    "Jump Game": "Greedy",
    "Jump Game II": "Greedy",
    "Gas Station": "Greedy",
    "Hand of Straights": "Greedy",
    "Merge Triplets to Form Target Triplet": "Greedy",
    "Partition Labels": "Greedy",
    "Valid Parenthesis String": "Greedy",

    // Intervals
    "Insert Interval": "Intervals",
    "Merge Intervals": "Intervals",
    "Non Overlapping Intervals": "Intervals",
    "Meeting Rooms": "Intervals",
    "Meeting Rooms II": "Intervals",
    "Minimum Interval to Include Each Query": "Intervals",

    // Math & Logic
    "Rotate Image": "Math & Logic",
    "Spiral Matrix": "Math & Logic",
    "Set Matrix Zeroes": "Math & Logic",
    "Happy Number": "Math & Logic",
    "Plus One": "Math & Logic",
    "Pow(x, n)": "Math & Logic",
    "Multiply Strings": "Math & Logic",
    "Detect Squares": "Math & Logic",

    // Bit Manipulation
    "Single Number": "Bit Manipulation",
    "Number of 1 Bits": "Bit Manipulation",
    "Counting Bits": "Bit Manipulation",
    "Reverse Bits": "Bit Manipulation",
    "Missing Number": "Bit Manipulation",
    "Sum of Two Integers": "Bit Manipulation",
    "Reverse Integer": "Bit Manipulation"
};

async function populateProblems() {
    try {
        // First, delete all existing problems
        await prisma.problem.deleteMany({});
        console.log('Deleted all existing problems');

        // Then create new problems
        for (const problem of problemsData) {
            try {
                const category = problemCategories[problem.title] || 'Unknown';
                
                // Handle different URL field names
                const leetcodeUrl = problem.leetcodeUrl || problem.leetcodeLink;
                const neetcodeUrl = problem.neetcodeUrl || problem.neetcodeLink;
                
                if (!leetcodeUrl || !neetcodeUrl) {
                    console.warn(`Skipping problem ${problem.title} due to missing URLs`);
                    continue;
                }

                const result = await prisma.problem.create({
                    data: {
                        title: problem.title,
                        difficulty: problem.difficulty,
                        leetcodeUrl,
                        neetcodeUrl,
                        categoryName: category
                    }
                });
                
                console.log(`Created problem: ${problem.title} in category: ${category}`);
            } catch (error) {
                console.error(`Failed to create problem: ${problem.title}`);
                console.error('Error details:', error);
                continue;
            }
        }
        
        console.log('All problems created successfully');
    } catch (error) {
        console.error('Error populating problems:', error);
    } finally {
        await prisma.$disconnect();
    }
}

populateProblems();