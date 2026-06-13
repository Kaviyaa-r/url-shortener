
🔗 SnapLink — URL Shortener with Analytics

A full-stack URL shortener platform with real-time analytics, QR code generation, and a stunning glassmorphism UI featuring interactive floating orbs and responsive layouts.
🎥 Demo Video
📹 Watch the full demo on Loom/YouTube ← ( )

✨ Features
Core Features
🔐 Authentication — Secure signup/login with JWT tokens, bcrypt password hashing
🔗 URL Shortening — Paste any long URL and get a short, shareable link instantly
📊 Analytics Dashboard — Track clicks, last visited time, and full visit history
🗂️ User Dashboard — View, copy, delete all your shortened URLs in one place
🔁 Server-side Redirect — Fast redirect handled entirely on the backend

Bonus Features
📱 QR Code Generation — Instant QR code for every short URL
⏳ Expiry Dates — Set links to auto-expire after a chosen date
✏️ Edit Destination — Update the destination URL without changing the short link
🏷️ Custom Aliases — Choose your own short code (e.g. /my-brand)
📈 Click Trend Charts — Daily click bar chart per URL (last 7 days)
🌐 Device & Browser Tracking — See what devices/browsers visitors use
🎨 Glassmorphism UI — Modern dark aesthetic with frosted glass components, dynamic hover effects, and animated background orbs


<img width="827" height="582" alt="image" src="https://github.com/user-attachments/assets/cd7fa6f7-4a5f-4d66-8442-03527ca02510" />



🗂️ Project Structure
<img width="483" height="888" alt="image" src="https://github.com/user-attachments/assets/f3a913be-d48f-4c3a-a2a2-20caead237cb" />


🚀 Setup Instructions
Prerequisites
Node.js v18+
npm v9+
A free MongoDB Atlas account

1. Clone the repository
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener

2. Backend Setup
cd backend
npm install
Create a .env file in the backend/ folder:
envPORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/urlshortener?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_string_minimum_32_chars
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:5000

Start the backend:
bashnpm run dev

3. Frontend Setup
bashcd ../frontend
npm install
Create a .env file in the frontend/ folder:
envVITE_API_URL=http://localhost:5000
Start the frontend:
 npm run dev

4. Open the app
Visit http://localhost:3000 in your browser.


🔌 API Reference

MethodEndpointAuthDescriptionPOST/api/auth/signup❌
Register new userPOST/api/auth/login❌Login,
returns JWTGET/api/urls✅
Get all URLs for userPOST/api/urls✅
Create short URLPATCH/api/urls/:id✅
Edit destination URLDELETE/api/urls/:id✅
Delete a URLGET/api/analytics/:shortCode✅
Get analytics for a URLGET/:shortCode❌
Redirect to original URL


💡 Assumptions Made
1.Short codes are 7 characters — generated using nanoid, collision-resistant for typical usage volumes.
2.No email verification — users can sign up and use the app immediately; email verification was out of scope for the hackathon timeline.
3.MongoDB Atlas free tier — the app is designed to run on Atlas M0 (free), so connection pooling and query counts are kept minimal.
4.Base URL is configurable — the BASE_URL env variable controls what domain short links display (e.g. switch from localhost:5000 to your production domain).
5.IP addresses are stored as-is — no geolocation lookup is performed; raw IP is stored for potential future use.
6.Expired links return a 410 Gone — rather than silently redirecting or returning 404, expired links show a clear expiry message.
7.JWTs expire after 7 days — users stay logged in for a week before needing to re-authenticate.
8.Analytics history shows last 50 visits — capped to keep the UI clean and API responses fast.


🤖 AI Planning Document

Approach

This project was planned and built with the assistance of Claude (Anthropic) as an AI pair programmer. The workflow followed was:

Requirements Analysis — Broke down the problem statement into P0/P1/P2 features prioritized by time-to-value
Architecture Design — Designed a 3-layer architecture (React SPA → Express REST API → MongoDB) with clear separation of concerns
Data Modeling — Designed three MongoDB collections: users, urls, visits — keeping visit records separate from URL documents to allow rich analytics without bloating the URL collection
API Design — Defined RESTful endpoints before writing any code
Build Order — Backend models → Backend routes → Frontend auth → Frontend dashboard → Analytics → Polish


Key Technical Decisions
nanoid over uuid — Shorter, URL-safe unique IDs (7 chars vs 36)
Server-side redirect — The Express server handles /:shortCode so click tracking is guaranteed regardless of browser/client
JWT in Authorization header — More secure than cookies for a hackathon demo; avoids CSRF complexity
Recharts for charts — Lightweight, React-native charting library with good defaults
React Context for auth — Avoids Redux complexity while giving global auth state


📸 Sample Output
DB entries
<img width="1888" height="862" alt="Screenshot 2026-06-13 162438" src="https://github.com/user-attachments/assets/52dbdd14-9190-4432-bb86-ae692e079afd" />
<img width="1871" height="898" alt="Screenshot 2026-06-13 162501" src="https://github.com/user-attachments/assets/b8d7ed15-8d20-4b5d-8f70-94d38fb9b126" />
<img width="1915" height="902" alt="Screenshot 2026-06-13 162515" src="https://github.com/user-attachments/assets/d4f95e06-6790-4e84-8878-d98db744c03c" />
<img width="1871" height="908" alt="Screenshot 2026-06-13 162530" src="https://github.com/user-attachments/assets/55c46c19-093b-4b68-9b3d-94b09a6a1708" />
<img width="1863" height="876" alt="Screenshot 2026-06-13 162544" src="https://github.com/user-attachments/assets/38c4affd-a304-414c-9426-f1ba544a627b" />
<img width="1863" height="876" alt="image" src="https://github.com/user-attachments/assets/894e5bad-011e-4009-892a-af389516ec63" />


🌐 Live Demo
🚀 Live App ← (Add deployment URL if applicable)

This project is a part of a hackathon run by https://katomaran.com


