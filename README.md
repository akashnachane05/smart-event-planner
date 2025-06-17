# 🌤️ Smart Event Planner 
A full-stack Node.js application that allows users to plan events, fetch weather forecasts, analyze weather suitability based on event type, and get personalized recommendations.
Built for the **DevDynamics Internship Assessment**. It integrates external APIs like **OpenWeatherMap** and **Google Places**, supports caching, and includes a simple HTML+Bootstrap frontend.
---

## 🌐 Live Demo

🚀 [Deployed on Railway](https://smart-event-planner-production.up.railway.app/)

- Open: `/public/index.html` → Full working frontend
- Backend APIs: Hosted on same base URL

---

## 🧪 Postman Collection
🔗 [Public Gist Link](https://gist.github.com/akashnachane05/edd11ebbefb23e1ccf00f75364eb063a.js)

## 🚀 Features

- 🗓️ Create, update, and view events
- ☁️ Fetch 5-day weather forecasts for event location and date
- 📊 Analyze weather suitability based on event type
- ❗ Handle invalid cities and dates with proper error messages
- 💾 In-memory caching to reduce API calls (3-hour expiry)
- ✅ Simple Bootstrap UI to interact with all features
- 🔁 Complete Postman collection included

---

## 🧩 Tech Stack

- **Backend**: Node.js, Express, MongoDB (via Mongoose)
- **Frontend**: HTML, Bootstrap 5
- **APIs Used**:
  - OpenWeatherMap (forecast)
  - Google Places API (location validation)
- **Others**: In-memory caching, Postman test collection

---

## 🛠️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/akashnachane05/smart-event-planner.git
cd smart-event-planner
