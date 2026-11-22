# ShopEase – E-commerce Store

A full-stack MERN Stack E-commerce Store developed as part of the **CodeAlpha Internship**.

ShopEase provides an online shopping experience where users can browse products, search by name, filter by category, manage their shopping cart, place orders, and view their order history.

## Features

- User Registration and Login
- Secure Authentication using JWT
- Password Hashing using bcrypt
- Browse Products
- Search Products
- Filter Products by Category
- Product Details
- Add Products to Cart
- Update Product Quantity
- Remove Products from Cart
- Place Orders
- View My Orders
- MongoDB Database Integration
- Stock Management

## Technologies Used

**Frontend**
- React.js
- Vite
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```text
CodeAlpha_EcommerceStore/
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PoojaPatelX13/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
node server.js
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Security

- Environment variables are stored in a local `.env` file.
- Sensitive credentials are excluded using `.gitignore`.
- Passwords are hashed before being stored in the database.

## Project

**Project Name:** ShopEase – E-commerce Store

**Internship:** CodeAlpha

**Project Type:** Full Stack Web Development

**Developer:** Pooja Patel
