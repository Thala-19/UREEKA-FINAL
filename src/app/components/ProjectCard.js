'use client';

import { GitHubIcon, UpvoteIcon, CommentIcon } from './Icons.js';

export default function ProjectCard({ project, onUpvote, onSelectProject, isUpvoted }) {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col justify-between hover:shadow-green-500/20 transition-shadow duration-300">
            <div>
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <GitHubIcon />
                    </a>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.split(',').map(tag => tag.trim()).map(tag => (
                        <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                <div className="bg-gray-900 p-3 rounded-md mb-4">
                    <h3 className="font-semibold text-green-400 mb-1">Postmortem: What Went Wrong?</h3>
                    <p className="text-gray-300 text-sm">{project.blurb}</p>
                </div>
                <p className="text-xs text-gray-500 mb-4">Submitted by: {project.submitterId}</p>
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                <button onClick={() => onUpvote(project.id)} className="flex items-center gap-2 text-gray-400">
                    <UpvoteIcon upvoted={isUpvoted} />
                    <span className="font-bold text-lg">{project.upvotes}</span>
                </button>
                <button onClick={() => onSelectProject(project)} className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <CommentIcon />
                    <span>Comments</span>
                </button>
            </div>
        </div>
    );
}
