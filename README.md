# Backend Project

A RESTful backend application built using Node.js, Express.js and MongoDB.

This project provides backend APIs for authentication, payments, invoices, blogging and website-builder functionality.

## Features

- User Registration and Login
- JWT-based Authentication
- Password Hashing using bcrypt
- Email and Mobile OTP Verification
- Forgot Password and Password Reset
- Google OAuth Authentication
- Razorpay Payment Integration
- Payment Signature Verification
- Invoice Generation
- Blog Management APIs
- AWS S3 Image Upload
- Website Builder Project Management
- Builder Block Management
- Save Draft and Autosave functionality
- MongoDB Database Integration
- REST API architecture

## Tech Stack

### Backend
- Node.js
- Express.js
- JavaScript

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT
- bcrypt
- OTP Verification
- Google OAuth

### Payment
- Razorpay

### Cloud & Storage
- AWS EC2
- AWS S3

### Development Tools
- Git
- GitHub
- Postman
- VS Code
## Project Structure

```text
backend-project/
│
├── config/
│   ├── db.js
│   ├── plans.js
│   ├── razorpay.js
│   └── s3.js
│
├── controllers/
│   ├── authController.js
│   ├── paymentController.js
│   ├── invoiceController.js
│   └── blogController.js
│
├── middleware/
│
├── models/
│   ├── User.js
│   ├── Payment.js
│   ├── Subscription.js
│   ├── Invoice.js
│   └── Blog.js
│
├── routes/
│   ├── authRoutes.js
│   ├── paymentRoutes.js
│   └── blogRoutes.js
│
├── services/
│   ├── paymentService.js
│   ├── invoiceService.js
│   └── s3UploadService.js
│
├── utils/
│   ├── verifySignature.js
│   ├── generateInvoiceId.js
│   └── calculateGST.js
│
├── server.js
└── .gitignore
```

## Authentication

The authentication module provides:

- User registration
- Secure password hashing
- User login
- JWT token generation
- Protected API access
- Email OTP verification
- Mobile OTP verification
- Forgot password
- Password reset
- Google OAuth login

## Payment Integration

Razorpay is integrated for payment processing.

The payment flow includes:

```text
User selects plan
        ↓
Create Razorpay Order
        ↓
Razorpay Checkout
        ↓
Payment completed
        ↓
Server-side Signature Verification
        ↓
Payment saved in MongoDB
        ↓
Invoice generated
```


