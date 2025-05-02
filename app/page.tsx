'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AddProblemModal from './components/AddProblemModal';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  categoryName: string;
  status: string;
  reviewCount: number;
  lastReviewed: string | null;
  notes: string | null;
}

interface Stats {
  totalProblems: number;
  completedProblems: number;
  inProgressProblems: number;
  notStartedProblems: number;
  averageDifficulty: number;
}

interface ActivityData {
  date: Date;
  count: number;
}

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    status: '',
    search: ''
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; problemId: number | null }>({
    isOpen: false,
    problemId: null
  });

  useEffect(() => {
    fetchProblems();
    fetchStats();
    fetchActivityData();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch('/api/problems');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch problems');
      }
      
      if (Array.isArray(data)) {
        setProblems(data);
      } else {
        console.error('Expected array, got:', data);
        setProblems([]);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      setProblems([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchActivityData = async () => {
    try {
      const response = await fetch('/api/activity');
      const data = await response.json();
      setActivityData(data);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  };

  const handleDelete = async (problemId: number) => {
    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete problem');
      }

      // Refresh problems and stats
      fetchProblems();
      fetchStats();
      setDeleteConfirmation({ isOpen: false, problemId: null });
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const getRandomProblem = () => {
    const randomIndex = Math.floor(Math.random() * problems.length);
    const randomProblem = problems[randomIndex];
    window.location.href = `/problems/${randomProblem.id}`;
  };

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = !filters.difficulty || problem.difficulty === filters.difficulty;
    const matchesCategory = !filters.category || problem.categoryName === filters.category;
    const matchesStatus = !filters.status || problem.status === filters.status;
    const matchesSearch = !filters.search || 
      problem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      problem.categoryName.toLowerCase().includes(filters.search.toLowerCase());
    return matchesDifficulty && matchesCategory && matchesStatus && matchesSearch;
  });

  const categories = Array.from(new Set(problems.map(p => p.categoryName))).sort();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">LeetCode Tracker</h1>
            <p className="text-[var(--text-secondary)] mt-2">Track your coding journey</p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-success"
            >
              Add Problem
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={getRandomProblem}
              className="btn btn-primary"
            >
              Random Problem
            </motion.button>
          </div>
        </motion.div>

        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12"
          >
            <div className="card">
              <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">Total Problems</h3>
              <p className="text-3xl font-bold">{stats.totalProblems}</p>
            </div>
            <div className="card">
              <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">Completed</h3>
              <p className="text-3xl font-bold text-[var(--success)]">{stats.completedProblems}</p>
            </div>
            <div className="card">
              <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-[var(--warning)]">{stats.inProgressProblems}</p>
            </div>
            <div className="card">
              <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">Not Started</h3>
              <p className="text-3xl font-bold text-[var(--danger)]">{stats.notStartedProblems}</p>
            </div>
            <div className="card">
              <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">Avg Difficulty</h3>
              <p className="text-3xl font-bold">
                {(stats.averageDifficulty ?? 0).toFixed(1)}/3.0
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >

        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="input"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="text"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="overflow-x-auto rounded-lg border border-[var(--card-border)]"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left py-4 px-6 text-[var(--text-secondary)] font-medium">Title</th>
                <th className="text-left py-4 px-6 text-[var(--text-secondary)] font-medium">Category</th>
                <th className="text-left py-4 px-6 text-[var(--text-secondary)] font-medium">Difficulty</th>
                <th className="text-left py-4 px-6 text-[var(--text-secondary)] font-medium">Status</th>
                <th className="text-left py-4 px-6 text-[var(--text-secondary)] font-medium">Reviews</th>
                <th className="text-left py-4 px-6 text-[var(--text-secondary)] font-medium">Last Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <motion.tr
                  key={problem.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                  className="border-b border-[var(--card-border)] last:border-0"
                >
                  <td className="py-4 px-6">
                    <Link href={`/problems/${problem.id}`} className="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">
                      {problem.title}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-full text-xs bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]">
                      {problem.categoryName}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      problem.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400 border-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                      'bg-red-900/30 text-red-400 border-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      problem.status === 'Completed' ? 'bg-green-900/30 text-green-400 border-green-800' :
                      problem.status === 'In Progress' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                      'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)]'
                    }`}>
                      {problem.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[var(--text-secondary)]">{problem.reviewCount}</td>
                  <td className="py-4 px-6 text-[var(--text-secondary)]">
                    {problem.lastReviewed ? new Date(problem.lastReviewed).toLocaleDateString() : 'Never'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <AddProblemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={() => {
            fetchProblems();
            fetchStats();
          }}
          categories={categories}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Delete Problem</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Are you sure you want to delete this problem? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirmation({ isOpen: false, problemId: null })}
                  className="px-4 py-2 rounded-lg bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--card-hover)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteConfirmation.problemId && handleDelete(deleteConfirmation.problemId)}
                  className="px-4 py-2 rounded-lg bg-[var(--danger)] text-white hover:bg-[var(--danger-hover)] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
