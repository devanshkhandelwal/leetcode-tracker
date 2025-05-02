'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  categories: string[];
}

export default function AddProblemModal({ isOpen, onClose, onAdd, categories }: AddProblemModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    categoryName: categories[0] || '',
    leetcodeUrl: '',
    neetcodeUrl: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create problem');
      }

      // Reset form and close modal
      setFormData({
        title: '',
        difficulty: 'Easy',
        categoryName: categories[0] || '',
        leetcodeUrl: '',
        neetcodeUrl: ''
      });
      onClose();
      onAdd(); // Call onAdd after closing the modal
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="card w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Add New Problem</h2>
              <button
                onClick={onClose}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6 border border-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="input"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="input"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  LeetCode URL
                </label>
                <input
                  type="url"
                  value={formData.leetcodeUrl}
                  onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                  className="input"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  NeetCode URL
                </label>
                <input
                  type="url"
                  value={formData.neetcodeUrl}
                  onChange={(e) => setFormData({ ...formData, neetcodeUrl: e.target.value })}
                  className="input"
                  placeholder="https://neetcode.io/problems/..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--input-bg)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Problem
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 