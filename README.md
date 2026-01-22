<<<<<<< HEAD
# Tours Company Backend API

A comprehensive Node.js REST API for a Tours Company management system built with Express.js, MongoDB, Mongoose, and Zod validation.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Complete Flow](#complete-flow)
- [Setup & Installation](#setup--installation)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [Testing Guide](#testing-guide)
- [Environment Variables](#environment-variables)

## 🎯 Project Overview

This is a full-stack backend API for managing a tours company. It handles:
- User authentication with OTP verification
- Tour management (CRUD operations)
- Booking system
- Review system
- Role-based access control (Admin, User, Guide)
- Password reset functionality

## 🛠 Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose
- **Validation**: Zod 3.5.1
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer (for OTP and password reset)

## 🏗 Project Architecture

```
Tours_Company/
├── connections/          # Database connection files
├── controllers/          # Request handlers
├── middlewares/          # Authentication, validation, security
├── models/              # Mongoose schemas
├── routes/              # API route definitions
├── Schemas/             # Zod validation schemas
├── services/            # Business logic layer
├── Seed/                # Database seeders
├── swagger/             # API documentation
└── Validators/          # Legacy validators
```
