# ✔️ PostList

PostList is a full-stack single-page application (SPA) where users can sign up, log in, and manage blog posts and tasks. This guide explains how to set up the frontend and backend locally.

![postlist-website-showcase](https://raw.githubusercontent.com/FarhaanAli05/postlist/main/src/assets/postlist-website-showcase.png)

## ⚙️ Prerequisites

Make sure you have the following installed:
- Python 3.9+
- pip
- Node.js (v18+ recommended)
- npm

---

## 🛠️ Backend Setup (Django)

Open a terminal and run the following commands:

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

(Optional) Create a superuser for accessing the Django admin panel:

```bash
python manage.py createsuperuser
```

The backend should now be running at http://localhost:8000.

## 🖥️ Frontend Setup (React)

Open another terminal window and run:

```bash
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000.

---

All done! 🎉

---

## ✨ Features

- User authentication (sign up, log in, log out) using JWT
- Create, update, and delete blog posts and tasks
- Protected routes for authenticated users
- Responsive single-page design

---

## 🧱 Tech Stack

🔹 Frontend

- React 19 – Single-page application (SPA) architecture
- JavaScript – Core logic and interactivity
- JS-Cookie – For handling JWT tokens in the browser
- CSS – Styling and layout

🔹 Backend

- Django – Backend web framework
- Django REST Framework (DRF) – For building RESTful APIs
- djangorestframework-simplejwt – For JWT authentication
- SQLite – Lightweight local database for development
