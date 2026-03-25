# UNIT-01 — AI Chatbot

A full-stack AI chatbot I built as a college project using the MERN stack. Users can register, log in, chat with an AI, and view their past conversations. Works on mobile and tablet too.

---

## What it does

- Register and log in with your email and password
- Chat with an AI powered by Google Gemini
- Chat history is saved so you can come back to old conversations
- Delete chats you don't need anymore
- Works on phone, tablet and desktop

---

## Tech Stack

| Part | What I used |
|------|-------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Google Gemini API |
| API Calls | Fetch API |

---

## Project Structure

## How to Run

### 1. Clone the repo

```bash
git clone https://github.com/your-username/UNIT-01.git
cd UNIT-01
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```dotenv
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai-chatbot
JWT_SECRET=anyrandomstring
GEMINI_API_KEY=your_gemini_key_here
```

Get your free Gemini API key at **aistudio.google.com** — no credit card needed.

Start the server:

```bash
nodemon server.js
```

### 3. Setup Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## API Endpoints

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login and get token |

### Chat (requires JWT token in header)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/chat` | Send a message |
| GET | `/api/chat` | Get all chats |
| GET | `/api/chat/:id` | Get one chat |
| DELETE | `/api/chat/:id` | Delete a chat |

---

## How JWT Auth Works

1. User logs in → server creates a JWT token with the user's ID inside
2. Token is saved in `localStorage` on the frontend
3. Every API request sends the token in the header like this:
```
Authorization: Bearer <token>
```
4. `authMiddleware.js` checks the token before allowing access to protected routes

---

## Things I learned building this

- How JWT authentication works end to end
- Connecting React frontend to an Express backend using Fetch API
- Saving and retrieving chat history from MongoDB
- Making a responsive UI that works on mobile using Tailwind CSS
- Calling an external AI API (Gemini) from the backend

---

## Author

**Anas Mumtaz**
3rd Year B.Tech CSE — Jamia Hamdard

---

## License

This project is open source and free to use.
