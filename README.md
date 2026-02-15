# 🩸 LifeStream API | Backend Server

The backend engine for LifeStream, a blood donation and management platform. Built with Node.js, Express and MongoDB, featuring Firebase Admin SDK for secure authentication and Stripe for donation funding.

## 🚀 Live Server
**URL:** [https://bloodapp2.vercel.app/](https://bloodapp2.vercel.app/)

## 🛠️ Tech Stack
- **Runtime:** Node.js (Express.js)
- **Database:** MongoDB (Native Driver)
- **Authentication:** Firebase Admin SDK (JWT Verification)
- **Payments:** Stripe API
- **Deployment:** Vercel

## 📂 Project Structure

```text
server
├─ config
│  ├─ db.js
│  └─ firebase.js
├─ controllers
│  └─ userController.js
├─ middleware
│  ├─ verifyAdmin.js
│  ├─ verifyFirebaseToken.js
│  └─ verifyVolunteer.js
├─ models
│  ├─ index.js
│  └─ UserModel.js
├─ routes
│  ├─ adminRoutes.js
│  ├─ donationRoutes.js
│  ├─ paymentRoutes.js
│  ├─ userRoutes.js
│  └─ volunteerRoutes.js
├─ index.js
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ README.md
└─ vercel.json
└─ .env

```

## 🔐 Environment Variables
To run this project locally, create a **.env** file in the root directory and add:

```js
PORT=5000
DB_URI=your_mongodb_connection_string
ACCESS_TOKEN=your_jwt_secret
FIREBASE_PROJECT_ID=your_id
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_PRIVATE_KEY="your_private_key"
STRIPE_SECRET_KEY=your_stripe_key
```

## 📡 API Endpoints

### 👤 User Routes (/api/users)

- POST /register - Initialize/Create user profile (Auth required)

- GET /me - Get logged-in user details

- PATCH /update-profile - Update profile info

- GET /donors/search - Public search for blood donors

### 🩸 Donation Requests (/api/donation-requests)

- POST / - Create a new blood request

- GET /my-requests - Get requests created by the user

- PATCH /status/:id - Update status (Done/Canceled)

- PATCH /donate/:id - Volunteer to donate (Public)

### 👮 Admin Routes (/api/admin)

- GET /users - Manage all users (Pagination/Search)

- GET /admin-stats - Dashboard statistics (Total funds, users, requests)

- PATCH /users/:id - Change user roles or block/unblock users

### 🤝 Volunteer Routes (/api/volunteer)

- GET /all-requests - View all blood requests

- PATCH /update-status/:id - Update request status only

### 💳 Payment Routes (/api/payments)

- POST /create-payment-intent - Initialize Stripe payment

- POST /funds - Save successful donation record to DB

- GET /funds - View funding history (Private)

## 🛠️ Installation & Setup

1. Clone the repository:

```Bash
git clone <your-repo-url>
cd server
```

2. Install dependencies:

```Bash
npm install
```
3. Run in development mode:

```Bash
npm run dev
```

4. Production build:

```Bash
npm start
```

## 📄 License
This project is **NOT licensed under the ISC License**. It is developed solely for educational purposes to master the MERN stack.

- **Purpose**: Personal learning and portfolio development.

- **Usage**: This code is not intended for commercial use or distribution.

- **Learning Goals**: Implementation of Role Based Access Control (RBAC) Firebase Admin SDK, Stripe payment gateways and advanced MongoDB aggregation.


---

