# User Management System

A modern web application for managing team members and their information.

## Development Stack

### Frontend

- ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js) **Next.js**: React framework for server-rendered applications
- ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) **React**: JavaScript library for building user interfaces
- ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) **TypeScript**: Static typing for JavaScript
- ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS**: Utility-first CSS framework
- ![Faker.js](https://img.shields.io/badge/-Faker.js-4FC08D?style=flat-square&logo=javascript&logoColor=white) **Faker.js**: Generate realistic test data

### Backend

- ![Next.js API](https://img.shields.io/badge/-Next.js%20API-000000?style=flat-square&logo=next.js) **Next.js API Routes**: API endpoints for data operations
- ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) **Prisma**: Next-generation ORM for database access
- ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) **PostgreSQL**: Relational database (provided by Supabase)

### Infrastructure

- ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white) **Vercel**: Deployment and hosting platform
- ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) **Supabase**: Postgres database provider

## Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes for CRUD operations
│   ├── components/           # Reusable React components
│   │   ├── ClientDate.tsx    # Client-side date formatting
│   │   ├── FormModal.tsx     # Modal for forms
│   │   ├── Navigation.tsx    # Navigation component
│   │   ├── OperationModal.tsx # Confirmation/success modals
│   │   ├── TestList.tsx      # List component for tests
│   │   ├── TestTable.tsx     # Main table component
│   │   └── UserForm.tsx      # Form for user data
│   ├── csr/                  # Client-side rendering example
│   ├── isr/                  # Incremental Static Regeneration example
│   ├── ssg/                  # Static Site Generation example
│   ├── ssr/                  # Server-side rendering example
│   ├── styles/               # Styling utilities
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Home page component
├── lib/                      # Utility libraries
│   └── prisma.ts             # Prisma client configuration
├── prisma/                   # Database schema and migrations
│   └── schema.prisma         # Prisma schema
├── types/                    # TypeScript type definitions
└── public/                   # Static assets
```

## Live Demo

Check out the live demo: [User Management System](https://next-js-web-app-git-main-r-thinkings-projects.vercel.app)

## 📸 Screenshots

### Main Dashboard

![User Management System Dashboard](./public//full-screen.png)
_The main dashboard displays a table of users with name, phone number, age, and creation date, featuring a top navigation bar for different rendering methods (Home, CSR, SSR, SSG, ISR)._

### User Search

![User Search Functionality](./public/search-user.png)
_The search functionality filters users in real-time, showing only matching results like the "Kim" search demonstrated here._

### Add New User

![Add New User Form](./public/create-user.png)
_The Add New User modal provides fields for name, phone, and age with a handy "Fill Random Data" button to generate test data._

### Update User

![Update User Form](./public/update-user.png)
_The Update User form comes pre-filled with the user's existing data and offers the same random data generation feature for testing._

### Delete Confirmation

![Delete User Confirmation](./public/delete-user.png)
_A warning dialog asks for confirmation before deleting a user, preventing accidental deletions with clear Cancel and Delete options._

### Pagination

![Pagination Controls](./public/pagination.png)
_The table includes pagination controls that allow users to navigate through large datasets efficiently, with options to select items per page (10, 25, 50, 100), navigate between pages, and view current page information._

## About

This User Management System is a full-featured web application that allows organizations to manage their team members efficiently. It provides a clean, intuitive interface for adding, editing, viewing, and deleting user information.

## Key Features

- **User Management**: Add, view, edit, and delete user information
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Search Functionality**: Quickly find users by name or phone number
- **Pagination**: Navigate through user data efficiently
- **Multiple Rendering Methods**: Demonstrates different Next.js rendering techniques (CSR, SSR, SSG, ISR)
- **Data Validation**: Ensures data integrity
- **Random Data Generation**: Quickly create test users

## Functions

### User Management

The application provides comprehensive user management capabilities:

1. **Create Users**: Add new team members with name, phone, and age information
2. **Read User Data**: View all team members in a paginated table format
3. **Update Users**: Edit existing user information
4. **Delete Users**: Remove users with confirmation dialog
5. **Search Users**: Find specific users by name or phone number
6. **Random Data Generation**: Generate placeholder data for testing

### Rendering Methods

The application demonstrates four different rendering methods in Next.js:

1. **CSR (Client-Side Rendering)**: Data is fetched on the client side after the page loads
2. **SSR (Server-Side Rendering)**: Data is fetched on the server for each request
3. **SSG (Static Site Generation)**: Pages are pre-rendered at build time
4. **ISR (Incremental Static Regeneration)**: Static pages that update after a specified interval

## Usage

### Main Page

The main dashboard displays all users in a table format with the following features:

- Search bar for filtering users
- Add New User button
- Table columns for Name, Phone, Age, and Created date
- Edit and Delete actions for each user
- Pagination controls and items per page selection

### Adding a User

1. Click the "Add New User" button
2. Fill in the user details (or use "Fill Random Data")
3. Click "Create" to save the new user

### Editing a User

1. Click the "Edit" button next to the user
2. Modify the user details in the form
3. Click "Update" to save changes

### Deleting a User

1. Click the "Delete" button next to the user
2. Confirm deletion in the warning dialog
3. User will be removed from the database

### Searching

Type in the search box to filter users by name or phone number. Results update in real-time.

### Pagination

The table includes pagination controls:

- Select items per page (10, 25, 50, 100)
- Navigate between pages
- View current page information (e.g., "1-25 of 27 items")

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository

```
git clone https://github.com/your-username/user-management-system.git
cd user-management-system
```

2. Install dependencies

```
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env.local` file with the following:

```
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
```

4. Run database migrations

```
npx prisma migrate dev
```

5. Start the development server

```
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## License

This project is licensed under the MIT License - see the LICENSE file for details.
