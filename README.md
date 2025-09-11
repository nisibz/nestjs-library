# NestJS Library Management System

A comprehensive library management system built with NestJS, featuring book management, user authentication, file uploads, and request logging.

## Features

- Complete CRUD operations for books with cover image uploads
- User authentication with JWT tokens and bcrypt password hashing
- Book borrowing and returning system with transaction tracking
- File upload functionality with static asset serving
- Comprehensive HTTP request logging middleware
- Database management with Prisma ORM and PostgreSQL
- Type-safe implementation with TypeScript and validation pipes

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm
- PostgreSQL database
- Docker (optional)

### Installation

Clone this repository:

```
git clone https://github.com/nisibz/nestjs-library-tests.git
cd nestjs-library-tests
```

## Development Mode

### Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up your environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database configuration
DATABASE_URL="postgresql://username:password@localhost:5432/library"
JWT_SECRET="your-jwt-secret"
PORT=3100
```

3. Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

4. Start the development server:

```bash
pnpm run start:dev
```

5. Open [http://localhost:3100](http://localhost:3100) in your browser

### Docker Development Setup

1. Create the Docker network:

```bash
docker network create library-network
```

2. Start the development containers:

```bash
docker compose up -d
```

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Access the application at [http://localhost:3100](http://localhost:3100)

To stop the containers:

```bash
docker compose down
```

### Database Management

View and manage your database with Prisma Studio:

```bash
npx prisma studio
```

## Production Mode

### Local Production Setup

1. Create an optimized production build:

```bash
pnpm run build
```

2. Run database migrations:

```bash
npx prisma migrate deploy
```

3. Start the production server:

```bash
pnpm run start:prod
```

4. Access the application at [http://localhost:3100](http://localhost:3100)

### Docker Production Setup

1. Build the production Docker image:

```bash
docker build -t nestjs-library:prod -f Dockerfile.prod .
```

2. Create production environment file:

```bash
cp .env.example .env.production
# Edit .env.production with your production configuration
```

3. Run the production container:

```bash
docker run -p 3100:3100 \
  --env-file .env.production \
  --name nestjs-library-prod \
  nestjs-library:prod
```

4. Access the application at [http://localhost:3100](http://localhost:3100)

To stop the production container:

```bash
docker stop nestjs-library-prod
docker rm nestjs-library-prod
```

## Development Commands

### Package Management

- Install dependencies: `pnpm install`

### Development Server

- Start development server: `pnpm run start:dev` (includes watch mode)
- Start production server: `pnpm run start:prod`
- Debug mode: `pnpm run start:debug`

### Build and Linting

- Build project: `pnpm run build`
- Lint code: `pnpm run lint` (auto-fixes issues)
- Format code: `pnpm run format`

### Testing

- Run unit tests: `pnpm run test`
- Watch mode: `pnpm run test:watch`
- E2E tests: `pnpm run test:e2e`
- Coverage report: `pnpm run test:cov`
- Debug tests: `pnpm run test:debug`

### Database

- Generate Prisma client: `npx prisma generate`
- Run migrations: `npx prisma migrate dev`
- Seed database: `npx prisma db seed`
- Prisma Studio: `npx prisma studio`

## API Documentation

The application provides the following main endpoints:

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Books Management

- `GET /books` - List all books (requires authentication)
- `POST /books` - Create a new book (requires authentication)
- `GET /books/:id` - Get book details
- `PATCH /books/:id` - Update book information
- `DELETE /books/:id` - Delete a book
- `POST /books/:id/borrow` - Borrow a book
- `POST /books/:id/return` - Return a book
- `GET /books/:id/transactions` - View book transaction history

### User Management

- `GET /user/borrowed-books` - Get user's borrowed books (requires authentication)

### File Uploads

- Book cover images can be uploaded via multipart/form-data
- Static files served at `/uploads/` endpoint

## Technology Stack

- **Framework**: NestJS - Progressive Node.js framework
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer with local file storage
- **Validation**: class-validator with ValidationPipe
- **Logging**: Built-in NestJS Logger with custom HTTP middleware
- **Language**: TypeScript with strict type checking

## Architecture

### Core Structure

- **Database Layer**: Prisma ORM with PostgreSQL
- **Service Layer**: Repository pattern with dedicated service classes
- **API Layer**: REST controllers with validation and file upload support
- **File Management**: Custom file service with multer integration

### Key Modules

1. **PrismaModule** (`src/prisma/`): Database connection and service
2. **AuthModule** (`src/auth/`): User authentication and authorization
3. **BooksModule** (`src/books/`): Complete CRUD operations for books with file uploads
4. **UserModule** (`src/user/`): User management and borrowed books tracking
5. **Upload Utils** (`src/utils/upload/`): File handling, multer configuration, and path management
