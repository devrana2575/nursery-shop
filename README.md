# 🌿 Online Nursery Shop — MERN Mini Project 2026

A full-stack web application for online plant purchasing and nursery management, built with the **MERN** stack.

---

## ✅ Features

### User Features
- 🔐 Register & Login with session persistence (localStorage)
- 🏠 Home page with Featured Plants section
- 🔍 Search plants by name or category
- 🌿 Category filter pills (Indoor, Outdoor, Flowering, etc.)
- 🛒 Add to Cart, update quantity, remove items
- 📦 Place orders with delivery address (Cash on Delivery)
- 📋 My Orders — view order history and status
- 🌱 Plant Care Tips popup (watering, sunlight, fertilizer)
- 📞 Contact page with form
- ℹ️ About page

### Admin Features
- 📋 Admin Dashboard — view & manage all plants
- ➕ Add Plant with image URL, category, price, stock, care tips
- ✏️ Edit existing plant details
- 🗑️ Delete plants
- 📦 View & update order statuses (Pending → Confirmed → Delivered)

### UX & Polish
- ✅ Toast notifications for all actions (add to cart, order placed, etc.)
- 🚪 Logout confirmation dialog
- 🪴 Better empty states (empty cart, no orders)
- 🌵 404 Not Found page
- ⏳ Loading spinners
- 🌿 Footer with project info
- 📱 Responsive navbar (role-based: User vs Admin)
- 🇮🇳 Indian pricing (₹)

---

## 🛠️ Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | React.js (Vite)    |
| Backend   | Node.js, Express   |
| Database  | MongoDB (Mongoose) |
| HTTP      | Axios              |

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

### Backend Setup
```bash
cd backend
npm install
node seed.js        # Seeds admin + 8 demo plants
node server.js      # Starts server on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev         # Starts on http://localhost:5173
```

---

## 🔑 Default Credentials

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@nursery.com    | admin123  |
| User  | Register a new account | -       |

---

## 🌱 Demo Plants (pre-seeded)
- Monstera (Indoor) — ₹549
- Snake Plant (Indoor) — ₹249
- Aloe Vera (Succulents) — ₹199
- Rose Bush (Flowering) — ₹399
- Tulsi / Holy Basil (Herbs) — ₹79
- Bougainvillea (Outdoor) — ₹329
- Peace Lily (Indoor) — ₹349
- Marigold (Flowering) — ₹49

---

## 📁 Project Structure

```
nursery-final/
├── backend/
│   ├── server.js       # Express API (auth, plants, orders)
│   ├── seed.js         # Seeds DB with admin + plants
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx                  # Routing, auth, state
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   └── Toast.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── UserHome.jsx         # Browse + featured + search
    │       ├── CartPage.jsx
    │       ├── MyOrders.jsx
    │       ├── PlantList.jsx        # Admin plant management
    │       ├── AddPlant.jsx
    │       ├── EditPlant.jsx
    │       ├── AdminOrders.jsx
    │       ├── About.jsx
    │       ├── Contact.jsx
    │       └── NotFound.jsx         # 404 page
    └── package.json
```

---

## 🔮 Future Scope

- JWT-based authentication with token expiry
- Payment gateway integration (Razorpay / UPI)
- User profile & address book
- Product image upload (Cloudinary)
- Email notifications for order updates
- Ratings & reviews for plants
- Admin analytics dashboard
- PWA / mobile app version

---

## 👨‍💻 Developer

**Dev** | MCA Mini Project 2026  
Built with ❤️ using the MERN Stack
