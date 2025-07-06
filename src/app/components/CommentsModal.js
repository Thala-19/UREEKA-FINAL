'use client';

import { useState } from 'react';

export default function CommentsModal({ project, comments, onClose, onAddComment }) {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
                <h2 className="text-2xl font-bold text-white mb-2">{project.title} - Comments</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl">&times;</button>
                
                <div className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="bg-gray-700 p-3 rounded-lg mb-3">
                                <p className="text-gray-300">{comment.text}</p>
                                <p className="text-xs text-gray-500 mt-2">By: {comment.authorId}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No comments yet. Be the first to offer condolences.</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-auto">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add your insightful comment..."
                        rows="3"
                        className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                    ></textarea>
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Post Comment</button>
                </form>
            </div>
        </div>
    );
}
