# Architecture

## Frontend

React app with TypeScript. Components organized by feature, using hooks for logic, Context API for state.

API Layer:

- /api/auth.ts - Authentication endpoints
- /api/projects.ts - Project CRUD
- /api/tasks.ts - Task CRUD
- /api/section.ts - Section operations

State Management:

- AuthContext - Current user, login/logout
- ProjectsContext - All projects, current selection
- TasksContext - Tasks for current view, CRUD ops

Custom Hooks:

- useAuth - Authentication logic
- useTasks - Task operations
- useProjects - Project operations
- useSections - Section operations
- useIsMobile - Mobile detection
- useFilteredTasks - Filter for tasks depending on mode or selected project ID
- useTaskSelection - Operations on multiple tasks

Components:

- AppLayout - Main layout wrapper
- Sidebar/MobileMenu - Navigation
- TaskForm, TaskList, TaskCard - Task management
- ProjectPage, ProjectForm, ProjectCard - Projects
- AuthPage - Login/register
- Calendar, Timeselector - Date picking

Styling: TailwindCSS utility classes, responsive design with md: breakpoint.

## Backend

Express.js with TypeScript. Controllers handle business logic, routes define endpoints, middleware handles auth.

Controllers:

- auth.controller.ts - Register, login, user profile
- project.controller.ts - Project CRUD
- task.controller.ts - Task CRUD
- section.controller.ts - Section CRUD

Routes:

- /api/auth - Authentication endpoints
- /api/projects - Project endpoints
- /api/tasks - Task endpoints
- /api/sections - Section endpoints

Middleware:

- authMiddleware - JWT verification, sets req.userId

## Database (Prisma)

Models:

- User - id, email, userName, passwordHash, createdAt
- Project - id, title, color, favorites, order, userId
- Section - id, title, order, projectId, userId
- Task - id, title, isDone, priority, order, deadline, etc.

Relationships:

- User has many Projects, Sections, Tasks
- Project has many Sections and Tasks
- Section has many Tasks
- Task can have subtasks (self-relation with parentId)

Cascade deletes: Deleting user/project/section/task removes related data.

## Authentication

JWT tokens + bcrypt password hashing.

Flow:

1. User registers/logs in
2. Backend hashes password, generates JWT
3. Backend stores JWT in httpOnly secure cookie
4. Frontend sends all requests with cookies automatically
5. authMiddleware verifies token from cookies and sets

## Data Flow

Component → Custom Hook → Context → API Client → Backend Controller → Prisma → Database

Example (create task):

1. TaskForm submit
2. TasksContext.createTask()
3. POST /api/tasks
4. task.controller.createTask()
5. prisma.task.create()
6. Response returns to frontend
7. Context updates, UI re-renders

## Key Patterns

Optimistic updates: UI updates before API response (with rollback on error)

User scoping: All queries include userId filter to prevent cross-user data access

Type safety: TypeScript throughout, Prisma generates types from schema

Cascading: Deleting parent records automatically deletes children
