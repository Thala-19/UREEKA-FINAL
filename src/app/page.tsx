'use client';

import { useState, useEffect, useMemo } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, addDoc, onSnapshot, updateDoc, increment, query, setDoc } from 'firebase/firestore';
import { db, auth, appId } from './config.js';

import ProjectCard from './components/ProjectCard.js';
import AddProjectModal from './components/AddProjectModal.js';
import CommentsModal from './components/CommentsModal.js';

interface Project {
    id: string;
    title: string;
    githubLink: string;
    tags: string;
    blurb: string;
    upvotes: number;
    submitterId: string;
}

interface Comment {
    id: string;
    text: string;
    authorId: string;
    createdAt: any;
}

export default function ProjectGraveyard() {
    const [userId, setUserId] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [upvotedProjects, setUpvotedProjects] = useState<{ [key: string]: boolean }>({});


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUserId(user.uid);
            } else {
                signInAnonymously(auth).catch(error => {
                    console.error("Anonymous sign-in failed:", error);
                });
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const projectsCollectionPath = `/artifacts/${appId}/public/data/projects`;
        const q = query(collection(db, projectsCollectionPath));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const projectsData: Project[] = [];
            querySnapshot.forEach((doc) => {
                projectsData.push({ id: doc.id, ...doc.data() } as Project);
            });
            setProjects(projectsData);
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        if (!userId) return;
        const userUpvotesDocPath = `/artifacts/${appId}/users/${userId}/upvotes/projects`;
        const docRef = doc(db, userUpvotesDocPath);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setUpvotedProjects(docSnap.data());
            } else {
                setUpvotedProjects({});
            }
        });
        return () => unsubscribe();
    }, [userId]);

    useEffect(() => {
        if (!selectedProject) {
            setComments([]);
            return;
        };
        const commentsCollectionPath = `/artifacts/${appId}/public/data/projects/${selectedProject.id}/comments`;
        const q = query(collection(db, commentsCollectionPath));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsData: Comment[] = [];
            querySnapshot.forEach((doc) => {
                commentsData.push({ id: doc.id, ...doc.data() } as Comment);
            });
            setComments(commentsData);
        });
        return () => unsubscribe();
    }, [selectedProject]);


    const handleAddProject = async (projectData: { title: string, githubLink: string, tags: string, blurb: string }) => {
        if (!userId) return;
        try {
            const projectsCollectionPath = `/artifacts/${appId}/public/data/projects`;
            await addDoc(collection(db, projectsCollectionPath), {
                ...projectData,
                upvotes: 0,
                createdAt: new Date(),
                submitterId: userId,
            });
            setShowAddModal(false);
        } catch (error) {
            console.error("Error adding project: ", error);
        }
    };

    const handleUpvote = async (projectId: string) => {
        if (!userId) return;
        
        const projectRef = doc(db, `/artifacts/${appId}/public/data/projects`, projectId);
        const userUpvotesRef = doc(db, `/artifacts/${appId}/users/${userId}/upvotes/projects`);
        const alreadyUpvoted = upvotedProjects[projectId];
        const incrementValue = alreadyUpvoted ? -1 : 1;

        try {
            await updateDoc(projectRef, { upvotes: increment(incrementValue) });
            const newUpvotedState = { ...upvotedProjects };
            if (alreadyUpvoted) {
                delete newUpvotedState[projectId];
            } else {
                newUpvotedState[projectId] = true;
            }
            await setDoc(userUpvotesRef, newUpvotedState);
        } catch (error) {
            console.error("Error upvoting project: ", error);
        }
    };

    const handleAddComment = async (commentText: string) => {
        if (!userId || !selectedProject) return;
        try {
            const commentsCollectionPath = `/artifacts/${appId}/public/data/projects/${selectedProject.id}/comments`;
            await addDoc(collection(db, commentsCollectionPath), {
                text: commentText,
                authorId: userId,
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    };

    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => b.upvotes - a.upvotes);
    }, [projects]);


    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
            <header className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-white">Project Graveyard</h1>
                    <p className="text-gray-400">Where good ideas go to rest. And be judged.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    + Bury a Project
                </button>
            </header>

            <main className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onUpvote={handleUpvote}
                            onSelectProject={setSelectedProject}
                            isUpvoted={!!upvotedProjects[project.id]}
                        />
                    ))}
                </div>
            </main>

            {showAddModal && <AddProjectModal onClose={() => setShowAddModal(false)} onAddProject={handleAddProject} />}
            {selectedProject && <CommentsModal project={selectedProject} comments={comments} onClose={() => setSelectedProject(null)} onAddComment={handleAddComment} />}
        </div>
    );
}
