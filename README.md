# Website Builder Application— Backend Project

A RESTful backend application built using Node.js, Express.js and MongoDB.

A backend service for a no-code, drag-and-drop website builder.
The application provides APIs for user authentication, project management,
builder blocks, payments, invoices and blogging.

The backend integrates MongoDB for data persistence, Razorpay for payments,
and AWS S3 for image storage.

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
## Invoice Management

The invoice module generates invoices after successful payment verification.

Invoice functionality includes:

- Automatic invoice generation
- Unique invoice ID generation
- Payment and customer details
- Plan and subscription details
- Invoice data stored in MongoDB
- Invoice retrieval through REST APIs

### Invoice Flow

```text
Payment Verified
       ↓
Generate Invoice ID
       ↓
Create Invoice
       ↓
Store Invoice in MongoDB
       ↓
Return Invoice Details
```

## Blog Management

The blogging module provides REST APIs for creating and managing blog posts.

### Features

- Create blog posts
- Update blog posts
- Delete blog posts
- Publish and unpublish posts
- Draft and published status
- Pagination
- Status filtering
- Sorting
- SEO title and description
- SEO keywords
- Slug generation
- Featured image upload
- AWS S3 image storage
- Sitemap generation

### Blog Flow

```text
Create Blog Post
       ↓
Validate Blog Data
       ↓
Upload Featured Image
       ↓
Store Image in AWS S3
       ↓
Save Blog Data in MongoDB
       ↓
Publish / Keep as Draft
```

## Website Builder

The backend provides APIs to manage website builder projects and their layouts.

### Features

- Create website projects
- Update projects
- Delete projects
- Save builder layout data
- Save draft projects
- Autosave builder changes
- Store project HTML content
- Project status management
- Template-based project creation

Builder data is stored in MongoDB and can be retrieved by the frontend builder application.

## Builder Blocks

The builder block module provides reusable blocks that can be used to construct websites.

### Block Properties

- Block name
- Block type
- Category
- Supported website views
- Icon
- Preview image
- Default block data

### Block Categories

- Basic blocks
- Advanced blocks

### Supported Views

- Landing pages
- Blog pages
- Portfolio pages
## AWS S3 Integration

AWS S3 is used for storing uploaded images and website-related assets.

The backend handles:

- Image upload
- Image processing
- Image conversion to WebP
- Upload to S3
- S3 URL generation
- Image access through stored URLs

AWS EC2 is used for backend deployment.
## API Architecture

The application follows a RESTful API architecture.

The backend separates responsibilities using:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

### Routes

Routes handle API endpoint definitions and HTTP methods.

### Controllers

Controllers handle incoming requests, validation and responses.

### Services

Services contain reusable business logic such as payment processing, invoice generation and S3 uploads.

### Models

Mongoose models define the MongoDB data structure.

## Security

The backend implements several security mechanisms:

- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- OTP-based verification
- Razorpay server-side signature verification
- Environment variables for sensitive configuration
- Input validation
- Error handling

Sensitive credentials such as database URLs, API keys and secrets are stored in environment variables and are not committed to GitHub.

## API Modules

| Module | Purpose |
|---|---|
| Authentication | Registration, login, OTP and password reset |
| Google OAuth | Google-based authentication |
| Templates | Website template management |
| Projects | Website project and draft management |
| Builder Blocks | Reusable website builder blocks |
| Payments | Razorpay payment processing |
| Invoices | Payment invoice generation |
| Blog | Blog CRUD and publishing |
| File Upload | Image upload and S3 storage |
| Sitemap | Sitemap generation |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/verify-email` | Verify email OTP |
| POST | `/api/auth/verify-mobile` | Verify mobile OTP |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/profile` | Get authenticated user profile |
| PUT | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/update-plan` | Update user plan |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/google/callback` | Google OAuth callback |

### Website Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/` | Create project |
| GET | `/api/projects/` | Get all projects |
| GET | `/api/projects/:id` | Get project by ID |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| PUT | `/api/projects/:id/autosave` | Autosave project |
| POST | `/api/projects/:id/duplicate` | Duplicate project |
| PUT | `/api/projects/:id/thumbnail` | Update project thumbnail |
| PUT | `/api/projects/:id/save-html` | Save project HTML |

### Builder Blocks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blocks/` | Get all builder blocks |
| GET | `/api/blocks/view` | Get blocks by view |
| GET | `/api/blocks/search` | Search builder blocks |
| GET | `/api/blocks/:id` | Get block by ID |
| POST | `/api/blocks/` | Create builder block |
| PUT | `/api/blocks/:id` | Update builder block |
| DELETE | `/api/blocks/:id` | Delete builder block |

### Templates

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/template/upload` | Upload template image |
| GET | `/api/template/list` | Get all templates |
| POST | `/api/template/` | Create template |
| GET | `/api/template/:id` | Get template by ID or slug |
| PUT | `/api/template/:id` | Update template |
| DELETE | `/api/template/:id` | Delete template |
| POST | `/api/template/:id/use` | Clone/use template |

### Payments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify-payment` | Verify Razorpay payment |
| GET | `/api/payment/invoices` | Get invoices |
| POST | `/api/payment/invoices` | Create invoice |

### Blog

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/blog/post` | Create blog post |
| GET | `/api/blog/posts/:workspaceId` | Get workspace blogs |
| GET | `/api/blog/public/:workspaceId` | Get public blogs |
| GET | `/api/blog/posts/:workspaceId/slug/:slug` | Get blog by slug |
| GET | `/api/blog/public/:workspaceId/:slug` | Get public blog by slug |
| PUT | `/api/blog/post/:id` | Update blog post |
| PATCH | `/api/blog/post/:id/publish` | Publish blog |
| DELETE | `/api/blog/post/:id` | Delete blog post |

### Products

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products/product` | Create product |
| GET | `/api/products/products/:workspaceId` | Get workspace products |
| GET | `/api/products/product/:id` | Get product by ID |
| PUT | `/api/products/product/:id` | Update product |
| DELETE | `/api/products/product/:id` | Delete product |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart/:workspaceId` | Get cart |
| POST | `/api/cart/:workspaceId/items` | Add item to cart |
| PUT | `/api/cart/:workspaceId/items/:itemId` | Update cart item |
| DELETE | `/api/cart/:workspaceId/items/:itemId` | Remove cart item |
| DELETE | `/api/cart/:workspaceId` | Clear cart |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ecommerce/orders/summary` | Create/get order summary |
| GET | `/api/ecommerce/orders/user/:userId` | Get user orders |
| GET | `/api/ecommerce/orders/pending` | Get pending orders |
| GET | `/api/ecommerce/orders/delivered` | Get delivered orders |
| GET | `/api/ecommerce/orders/revenue` | Get revenue |
| GET | `/api/ecommerce/orders/filter/date` | Filter orders by date |
| GET | `/api/ecommerce/orders/order/:id` | Get order by ID |
| PUT | `/api/ecommerce/orders/order/:id` | Update order status |
| PUT | `/api/ecommerce/orders/order/:id/cancel` | Cancel order |
| PUT | `/api/ecommerce/orders/order/:id/payment` | Save payment reference |
| GET | `/api/ecommerce/orders/:workspaceId` | Get workspace orders |

### File Upload

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload/upload` | Upload image |

### Contact & Feedback

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/contact/test` | Test contact API |
| POST | `/api/contact/` | Submit contact request |
| POST | `/api/contact/feedback/contact-feedback` | Submit feedback |
| GET | `/api/contact/feedback/contact-feedback` | Get all feedback |
| GET | `/api/contact/feedback/contact-feedback/:id` | Get feedback by ID |
| DELETE | `/api/contact/feedback/contact-feedback/:id` | Delete feedback |

### Sitemap

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sitemap/sitemap.xml` | Generate sitemap XML |
## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/PadmavathiRDev/backend-project.git
cd backend-project
npm install
```

Create a `.env` file in the project root and configure the required environment variables.

## Running the Project

### Development

```bash
npm run dev
```

The development server uses Nodemon and automatically restarts when files are changed.

### Production

```bash
npm start
```

## API Testing

APIs can be tested using Postman.

The backend can be started locally on:

```text
http://localhost:5000
```
## Environment Variables

The application uses environment variables for configuration and sensitive credentials.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```
Do not commit the .env file to GitHub.
## Deployment

The backend can be deployed using AWS EC2.

### Deployment Architecture

```text
Frontend
   ↓
AWS / Static Hosting
   ↓
Backend API
   ↓
AWS EC2
   ↓
MongoDB

File Uploads
   ↓
AWS S3
```
## Future Improvements

Possible future improvements include:

- Docker containerization
- CI/CD pipeline
- Redis caching
- API documentation using Swagger
- Automated unit and integration testing
- Improved monitoring and logging
  
## Author

Padmavathi R

Backend Developer

Technologies: Node.js, Express.js, MongoDB, FastAPI, Python, AWS


