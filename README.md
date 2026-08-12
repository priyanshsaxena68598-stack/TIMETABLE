# 🎓 Smart Scheduler: AI-Driven Academic Workload & Analytics Platform

[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688)](https://fastapi.tiangolo.com/)
[![Data Pipeline](https://img.shields.io/badge/Data-dbt%20%7C%20PostgreSQL-orange)](https://www.getdbt.com/)
[![Analytics](https://img.shields.io/badge/Analytics-PowerBI%20Embedded-yellow)](https://powerbi.microsoft.com/)

**Smart Scheduler** is an AI-powered, full-stack academic management workspace designed to solve student workflow fragmentation. It automatically converts dense lecture slides (`.pptx` / `.pdf`) into concise, exportable revision cards while tracking student workload, GPA metrics, and study habits in real time using an enterprise-grade **dbt + PowerBI** analytics engine.

---

## ✨ Key Features

* **🤖 AI Slide & PDF Summarizer:** Ingests complex lecture decks (`.pptx` and `.pdf`), parses syllabus concepts, and allows one-click dynamic PDF exports via `jsPDF`.
* **📊 Integrated Business Intelligence (dbt + PowerBI):** Transforms raw user activity logs into star-schema data models using **dbt** and visualizes study velocity, task completion, and GPA projections via embedded **PowerBI** dashboards.
* **📅 Academic Workload Hub:** Centralizes timetable management, time-blocking, target GPA calculations, and daily task tracking inside a unified interactive dashboard.
* **⚡ High-Performance Architecture:** Uses an asynchronous **FastAPI** microservice backend paired with a **React (Vite)** frontend for fast, low-latency performance.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, jsPDF |
| **Backend** | FastAPI, Python (NLP / Document Processing), REST APIs |
| **Database & Modeling** | PostgreSQL, dbt (data build tool) |
| **Analytics & BI** | PowerBI Embedded (DAX, Power Query) |




```text
├── frontend/             # React (Vite) application & UI components
│   ├── src/
│   │   ├── components/   # Dashboard widgets & PowerBI embeds
│   │   └── utils/        # jsPDF exporter & API helpers
│   └── package.json
├── backend/              # FastAPI microservices
│   ├── app/
│   │   ├── api/          # Endpoints for file parsing & analytics
│   │   └── main.py       # FastAPI application entry point
│   └── requirements.txt
├── dbt_transforms/       # dbt models for analytics & data quality checks
│   ├── models/           # SQL transformation models
│   └── dbt_project.yml
└── README.md

---

## 🚀 System Architecture & Workflow
