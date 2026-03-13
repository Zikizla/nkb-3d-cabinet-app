# NKB 3D Cabinet App

A 3D web application for viewing and manipulating cabinet models, built as a trial task for Nelson Cabinetry LLC.

## Features

- **3D Model Viewer** — Loads two GLB cabinet models with auto-scaling
- **Drag & Drop** — Move models around the scene with mouse dragging
- **Collision Prevention** — Models cannot overlap or occupy the same space
- **Rotation Editor** — Adjust model rotation via intuitive sliders (X, Y, Z axes)
- **2D/3D Toggle** — Switch between standard 3D perspective and top-down 2D view
- **Firestore Sync** — All position and rotation changes save to Firebase automatically
- **Persistent State** — Models load their last saved positions on page refresh

## Tech Stack

- **Next.js** (App Router, TypeScript)
- **Three.js** + **React Three Fiber** + **Drei**
- **Firebase Firestore**
- **Tailwind CSS**

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

Create a `.env.local` file in the project root with your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

- **Click** a model to select it (blue wireframe highlight)
- **Drag** a model to reposition it on the grid
- **Use the sliders** at the bottom to rotate the selected model
- **Toggle 2D/3D** with the button in the top-left corner
- All changes are saved automatically to Firestore
