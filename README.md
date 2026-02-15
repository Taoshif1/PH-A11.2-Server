# 🩸 LifeStream API | Backend Server

The backend engine for LifeStream, a blood donation & management platform. Built with Node.js, React, Express & MongoDB, featuring Role Based Access Control (RBAC), real-time blood request management, Firebase Admin SDK for secure authentication & Stripe for financial transactions.

## 🚀 Live Server
**URL:** [https://bloodapp2.vercel.app/](https://bloodapp2.vercel.app/)

## 🌟 Key Features
- **Secure Authentication:** Integration with Firebase Admin SDK for robust JWT-based identity verification.
- **RBAC (Role-Based Access Control):** Dedicated middleware for **Admin**, **Volunteer** & **Donor** roles to ensure data security.
- **Automated Payments:** Secure donation processing via **Stripe** with automated transaction logging.
- **Advanced Filtering:** Complex MongoDB queries for searching donors by Blood Group, District & Upazila.
- **Dashboard Analytics:** Aggregated statistics using MongoDB pipelines for real-time platform overview.

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

## 🗄️ Database Collections

- **bloodapp2users**: Stores donor/admin profile data & account status.

- **bloodapp2volunteer**: Stores dedicated volunteer applications & records.

- **bloodRequests**: Manages all active & historical blood donation requests.

- **funds**: Secure logs of all successful Stripe donations.

## 🔐 Environment Variables
To run this project locally, create a **.env** file in the root directory & add:

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

- **POST /register** - Initialize/Create user profile (Auth required)

- **GET /me** - Get logged-in user details

- **PATCH /update-profile** - Update profile info

- **GET /donors/search** - Public search for blood donors

### 🩸 Donation Requests (/api/donation-requests)

- **POST / - Create** a new blood request

- **GET /my-requests** - Get requests created by the user

- **PATCH /status/:id** - Update status (Done/Canceled)

- **PATCH /donate/:id** - Volunteer to donate (Public)

### 👮 Admin Routes (/api/admin)

- **GET /users** - Manage all users (Pagination/Search)

- **GET /admin-stats** - Dashboard statistics (Total funds, users, requests)

- **PATCH /users/:id** - Change user roles or block/unblock users

### 🤝 Volunteer Routes (/api/volunteer)

- **GET /all-requests** - View all blood requests

- **PATCH /update-status/:id** - Update request status only

### 💳 Payment Routes (/api/payments)

- **POST /create-payment-intent** - Initialize Stripe payment

- **POST /funds** - Save successful donation record to DB

- **GET /funds** - View funding history (Private)

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

---
## 🌟 Support & Connect

If you found this project helpful or learned something new from the implementation of **RBAC**, **Firebase Admin** or **Stripe**, please consider giving this repository a **Star** ⭐! It helps the project reach more developers.

### 🛠️ Need Customization or Upgrades?
Are you looking to scale this platform, integrate new features or need help with a similar MERN stack deployment? I'm open to collaborations and technical consultations.

**Let's build something impactful together!**

---

## 📄 License
This project is **NOT licensed under the ISC License**. It is developed solely for educational purposes to master the MERN stack.

- **Purpose**: Personal learning & portfolio development.

- **Usage**: This code is not intended for commercial use or distribution.

- **Learning Goals**: Implementation of Role Based Access Control (RBAC) Firebase Admin SDK, Stripe payment gateways & advanced MongoDB aggregation.