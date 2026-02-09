# Features

## Authentication

Register with email/password. Login with credentials. JWT stored in **httpOnly secure cookies** and included automatically in all requests. Password hashing with bcrypt (10 rounds). User scoping on all database queries.

## Projects

Create projects with title and color. Mark as favorite for quick access. View all projects in sidebar.
Update project details. Delete project (cascade deletes sections and tasks).

## Tasks

Create tasks in a project or standalone. Edit title, priority, deadline, comment.
Set priority (1-4). Set deadline with day picker. Mark complete/incomplete.
Add subtasks to break down work. Delete task (cascade deletes subtasks).

## Sections

Create sections within projects to organize tasks.
Update section title. Delete section (tasks are removed).
Tasks can be assigned to sections or left unsectionized.

## Task Organization

Tasks grouped by project and section. View all tasks or filter by project.
Subtasks nested under parent task. Show task hierarchy.

## User Profile

View current user info (email, username, created date).
Update username or email. Delete account (removes all user data).
See statistics (project count, active tasks).

## Responsive Design

Desktop: Sidebar navigation on left, main content on right.
Mobile: Bottom drawer for navigation, header at top.
Safe area handling for iOS notch and home indicator.
Touch-friendly button sizes and spacing.

## Mobile Features

Bottom drawer for projects navigation. Mobile-optimized forms.
Header menu access on mobile. Responsive task card layout.

## What's Working

All core CRUD operations for projects, tasks.
User authentication and profile management.
Responsive mobile and desktop layouts.
Task priorities and deadlines.
Subtask support.

## What's Planned

Phase 2:

- Drag-and-drop task reordering
- Search and filtering
- Sections
- Keyboard shortcuts
- better error handling
- board mode
- Automated tests

Phase 3:

- Analytics dashboard
- Productivity trends
