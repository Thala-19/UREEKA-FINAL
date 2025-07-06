'use client';

import { useState } from 'react';

export default function AddProjectModal({ onClose, onAddProject }) {
    const [title, setTitle] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [tags, setTags] = useState('');
    const [blurb, setBlurb] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddProject({ title, githubLink, tags, blurb });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Bury a New Project</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="title">Project Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="githubLink">GitHub Link</label>
                        <input type="url" id="githubLink" value={githubLink} onChange={e => setGithubLink(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="tags">Tags (comma-separated)</label>
                        <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., react, firebase, over-engineered" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="blurb">"What Went Wrong?" Blurb</label>
                        <textarea id="blurb" value={blurb} onChange={e => setBlurb(e.target.value)} rows="4" className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500" required></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Confirm Burial</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
