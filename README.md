# Inkspire 📚

Inkspire is a full-stack online bookstore built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication with JWT
- Add books to cart
- Persistent cart stored in database
- Checkout flow
- User profile with avatar upload
- Transaction history
- Admin-ready backend structure

## Tech Stack

Frontend
- React
- React Router
- React Bootstrap
- Framer Motion

Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Multer (image upload)

## Project Structure

```
inkspire
 ├ client        # React frontend
 ├ server        # Express backend
 ├ README.md
 └ .gitignore
```

## Installation

### Clone the repository

```
git clone https://github.com/sonotechnologies/inkspire.git
```

### Install dependencies

Frontend

```
cd client
npm install
```

Backend

```
cd server
npm install
```

### Setup environment variables

Create `.env` inside `/server`

```
DATABASE_URL="postgresql://postgres:123bolaji@localhost:5432/inkspire"
JWT_SECRET=inkspire_super_secret_key
```

### Run the project

Backend

```
npm run dev
```

Frontend

```
npm start
```

## Screenshots

(Add screenshots of your UI here later)

## Author

Sono Technologies