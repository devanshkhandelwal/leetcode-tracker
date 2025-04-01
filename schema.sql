-- Create problems table
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    leetcode_link VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Insert default categories
INSERT INTO categories (name) VALUES
    ('Arrays & Hashing'),
    ('Two Pointers'),
    ('Sliding Window'),
    ('Stack'),
    ('Binary Search'),
    ('Linked List'),
    ('Trees'),
    ('Tries'),
    ('Heap / Priority Queue'),
    ('Backtracking'),
    ('Graphs'),
    ('Advanced Graphs'),
    ('1-D Dynamic Programming'),
    ('2-D Dynamic Programming'),
    ('Greedy'),
    ('Intervals'),
    ('Math & Logic'),
    ('Bit Manipulation');

-- Create problem_categories junction table
CREATE TABLE problem_categories (
    problem_id INTEGER REFERENCES problems(id),
    category_id INTEGER REFERENCES categories(id),
    PRIMARY KEY (problem_id, category_id)
);