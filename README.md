# Project Graveyard

A digital cemetery for your abandoned projects. Share your unfinished work, write a postmortem on what went wrong, and let others learn from your glorious failures.

##Project Proposal

The full-written proposal for this program is made on Google Docs which is accessible via the following link:
https://docs.google.com/document/d/1YVl6AN_ugHvHM77sDw4WsmzYOt5SHqKmDr4RGbcPD-s/edit?usp=sharing

## Features

-   **Bury a Project**: Add your abandoned projects with a title, GitHub link, and relevant tags.
-   **Write a Postmortem**: For each project, write a "What Went Wrong" blurb to share your lessons learned.
-   **Upvote Insightful Failures**: Users can upvote the most insightful or relatable project failures.
-   **Comment Section**: A dedicated space for other developers to offer condolences, share similar experiences, or ask questions.
-   **Real-time Updates**: Built with Firebase, all projects, upvotes, and comments appear in real-time.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (v14+ with App Router)
-   **Language**: TypeScript
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   `npm` or `yarn` package manager
-   A Google account for Firebase

### 1. Clone the Repository

First, clone the project to your local machine.

```bash
git clone [https://github.com/your-username/project-graveyard.git](https://github.com/your-username/project-graveyard.git)
cd project-graveyard
```
### 2. Install Dependencies
   
Install all the necessary npm packages.npm install

### 3. Set Up Firebase
   
This project requires a Firebase project to handle the backend database and user authentication.
Create a Firebase Project: Go to the Firebase Console.
Click "+ Add project" and give it a name (e.g., "project-graveyard-app").
Disable Google Analytics for this project when prompted.
Add a Web App to your Project:

On your project's dashboard, click the web icon (</>). Give the app a nickname and click "Register app". 

Get Firebase Config Keys:

After registering, Firebase will show you a firebaseConfig object. Copy these keys.

Create a Configuration File:

In the project-graveyard/app/ directory, create a new file named config.js. Paste your keys into this file like so:

```bash
// In app/config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

export const appId = firebaseConfig.projectId;
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
Enable Firebase Services:Authentication: In the Firebase console, go to Build > Authentication > Sign-in method. Enable the Anonymous provider.Firestore: Go to Build > Firestore Database. Click "Create database", start in Production mode, and choose a location.Set Firestore Security Rules:In the Firestore Database section, go to the "Rules" tab.Replace the existing rules with the following to allow the app to function:rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public project data
    match /artifacts/{appId}/public/data/projects/{projectId} {
      allow read, create, update: if true;
      // Comments subcollection
      match /comments/{commentId} {
        allow read, create: if true;
      }
    }
    // Private user data (for tracking upvotes)
    match /artifacts/{appId}/users/{userId}/upvotes/projects {
       allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
Click "Publish".

### 4. Run the Development Server

You're all set! Run the development server to see your app in action.

```bash
npm run dev
Open http://localhost:3000 with your browser to see the result.Project Structure/project-graveyard
|
├── /app
│   ├── /components       # Reusable React components
│   │   ├── AddProjectModal.js
│   │   ├── CommentsModal.js
│   │   ├── Icons.js
│   │   └── ProjectCard.js
│   │
│   ├── config.js         # Firebase configuration keys
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Main app layout
│   └── page.tsx          # The main page component
│
├── package.json          # Project dependencies and scripts
└── README.md             # You are here
