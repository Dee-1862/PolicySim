# PolicySim: Climate Policy Analysis and Simulation Platform

## Overview
This project provides a web-based platform for exploring, analyzing, and simulating the impact of climate policies. It features a **React** frontend for interactive data visualization and filtering, powered by a **Flask** backend that integrates with external climate policy databases and **Gemini AI** for advanced analysis.

## Features
- **Comprehensive Policy Listing:** Browse a wide range of climate policies.
- **Detailed Policy View:** Get in-depth information on individual policies.
- **Climate Impact Simulation:** Visualize projected temperature trajectories based on policy parameters.
- **AI-Powered Analysis:** Receive AI-generated insights, strengths, weaknesses, and recommendations.
- **Responsive Design:** Optimized for seamless experience across various devices.

## Technologies Used
### **Frontend**
- **React**
- **Vite**
- **Tailwind CSS**
- **Shadcn/ui**
- **Recharts**
- **Framer Motion**

### **Backend**
- **Python 3.x**
- **Flask**
- **Flask-CORS**
- **Google Gemini API**
- **Google API** (Fetches the latitude and longitude of a location)
- **Open-Meteo API** (Fetches real-time temperature data)
- **cpdb_api** (External library for interacting with climate policy databases)
- **numpy**

## Potential Impact
This platform aims to **transform climate policy analysis** by offering **data-driven insights and AI-generated evaluations** for policymakers, researchers, and the public. It fosters transparency, enhances independent research, and serves as a collaborative space for refining climate strategies.

## Scalability
- Frontend and backend are **separately scalable** with **React's modularity** and Flask's lightweight nature.
- Backend can **horizontally scale** using **load balancers**.
- Integration with **external APIs** (Google, Google Gemini, Open-Meteo) offloads data handling.
- Supports **cloud-native deployment strategies**.

## Sustainability
- **Python & Flask** ensure low computational footprint.
- **API-based architecture** aligns with **modern, energy-efficient cloud infrastructure**.
- **Open-source** development encourages long-term **community contributions**.

## Setup Instructions

### **Prerequisites**
Ensure the following are installed:
- **Python 3.8+**
- **Node.js**
- **npm**

### **1. Backend Setup**
```sh
cd my-project-folder/backend
python -m venv .venv
venv/bin/activate
pip install -r requirements.txt
```

#### Configuring Gemini API Key:
```sh
echo 'GENAI_KEY="YOUR_GEMINI_API_KEY_HERE"' > .env
```

#### Running the Flask Application:
```sh
flask run
```
Backend will start with http://localhost:5000


### **2. Frontend Setup**
```sh
cd my-project-folder/frontend
npm install
npm run dev
```
Frontend will start with http://localhost:5173