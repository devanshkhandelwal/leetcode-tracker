'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { use } from 'react';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  categoryName: string;
  status: string;
  reviewCount: number;
  lastReviewed: string | null;
  notes: string | null;
  leetcodeUrl: string;
  neetcodeUrl: string;
}

export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [reviewCount, setReviewCount] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [resolvedParams.id]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`/api/problems/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error('Problem not found');
      }
      const data = await response.json();
      setProblem(data);
      setNotes(data.notes || '');
      setStatus(data.status);
      setReviewCount(data.reviewCount);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load problem');
      setIsLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(`/api/problems/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error('Failed to save notes');
      const data = await response.json();
      setProblem(data);
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleDeleteNotes = async () => {
    try {
      const response = await fetch(`/api/problems/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: null }),
      });
      if (!response.ok) throw new Error('Failed to delete notes');
      const data = await response.json();
      setProblem(data);
      setNotes('');
    } catch (error) {
      console.error('Error deleting notes:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/problems/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          lastReviewed: newStatus === 'Completed' ? new Date().toISOString() : null
        }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      setStatus(newStatus);
      await fetchProblem();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReviewCountChange = async (increment: boolean) => {
    const newCount = increment ? reviewCount + 1 : Math.max(0, reviewCount - 1);
    try {
      const response = await fetch(`/api/problems/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reviewCount: newCount,
          lastReviewed: new Date().toISOString()
        }),
      });
      if (!response.ok) throw new Error('Failed to update review count');
      setReviewCount(newCount);
      await fetchProblem();
    } catch (error) {
      console.error('Error updating review count:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/problems/${resolvedParams.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete problem');
      }

      router.push('/');
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl text-[var(--text-primary)] mb-4">{error || 'Problem not found'}</h1>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.push('/')}
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] mb-6 flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Problems
          </button>
          <h1 className="text-4xl font-bold mb-4">{problem.title}</h1>
          <div className="flex gap-4 items-center">
            <span className={`px-3 py-1 rounded-full text-sm border ${
              problem.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400 border-green-800' :
              problem.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
              'bg-red-900/30 text-red-400 border-red-800'
            }`}>
              {problem.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]">
              {problem.categoryName}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Progress</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleStatusChange('Not Started')}
                    className={`btn ${
                      status === 'Not Started' ? 'bg-[var(--input-bg)]' : 'bg-[var(--card-bg)]'
                    }`}
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => handleStatusChange('In Progress')}
                    className={`btn ${
                      status === 'In Progress' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'bg-[var(--card-bg)]'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange('Completed')}
                    className={`btn ${
                      status === 'Completed' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-[var(--card-bg)]'
                    }`}
                  >
                    Completed
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[var(--text-secondary)]">Reviews: {reviewCount}</span>
                  <button
                    onClick={() => handleReviewCountChange(true)}
                    className="btn btn-primary px-4"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleReviewCountChange(false)}
                    className="btn btn-primary px-4"
                  >
                    -
                  </button>
                </div>
                <div className="text-[var(--text-secondary)]">
                  Last Reviewed: {problem.lastReviewed ? new Date(problem.lastReviewed).toLocaleDateString() : 'Never'}
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Links</h2>
              <div className="flex gap-4">
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-yellow-900/30 text-yellow-400 border border-yellow-800 hover:bg-yellow-900/50 transition-colors"
                >
                  LeetCode
                </a>
                <a
                  href={problem.neetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-purple-900/30 text-purple-400 border border-purple-800 hover:bg-purple-900/50 transition-colors"
                >
                  NeetCode
                </a>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Notes</h2>
              <div className="flex gap-4">
                {notes && (
                  <button
                    onClick={handleDeleteNotes}
                    className="text-[var(--danger)] hover:text-[var(--danger-hover)] text-sm transition-colors"
                  >
                    Delete Notes
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="text-[var(--danger)] hover:text-[var(--danger-hover)] text-sm transition-colors"
                >
                  Delete Problem
                </button>
              </div>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input h-64 resize-none"
              placeholder="Add your notes here..."
            />
            <button
              onClick={handleSaveNotes}
              className="btn btn-primary mt-4"
            >
              Save Notes
            </button>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Delete Problem</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete this problem? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 rounded-lg bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--card-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-[var(--danger)] text-white hover:bg-[var(--danger-hover)] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 