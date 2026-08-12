import io
import requests
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from ortools.sat.python import cp_model

# 1. Initialize Application
app = FastAPI(title="Campus App Backend")

# 2. Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration & Keys
OPENWEATHER_API_KEY = "2fe49ef2c1702360ca168ea3786322a2"
CAMPUS_LAT = "23.0768"  # Campus coordinates
CAMPUS_LON = "76.8528"

# In-memory storage mock (or DB model)
users_db = {}

class UserAuth(BaseModel):
    username: str
    password: str

class SyllabusRequest(BaseModel):
    query: str


# --- AUTH ENDPOINTS ---
@app.post("/signup")
def signup(user: UserAuth):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[user.username] = user.password
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: UserAuth):
    if user.username not in users_db or users_db[user.username] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}

@app.post("/api/get-syllabus")
def get_syllabus(req: SyllabusRequest):
    return {"status": "success", "query": req.query, "syllabus": f"Syllabus details for {req.query}"}


# --- WEATHER ENDPOINT ---
@app.get("/api/weather")
def get_campus_weather():
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={CAMPUS_LAT}&lon={CAMPUS_LON}&appid={OPENWEATHER_API_KEY}&units=metric"
        # Added timeout=5 to prevent hanging
        response = requests.get(url, timeout=5)
        res = response.json()

        # Handle API Key activation errors or bad response
        if response.status_code != 200 or str(res.get("cod")) != "200":
            return {
                "location": "VIT Bhopal Campus",
                "temp": 28,
                "condition": "Overcast",
                "humidity": 70,
                "advice": "⛅ Weather data initializing. Have a great day on campus!",
                "icon": "⛅"
            }

        weather_condition = res["weather"][0]["main"]
        description = res["weather"][0]["description"].capitalize()
        temp = round(res["main"]["temp"])
        humidity = res["main"]["humidity"]

        advice = "Enjoy your day on campus!"
        icon = "☀️"

        if weather_condition.lower() in ["rain", "drizzle", "thunderstorm"]:
            advice = "🌧️ Rain expected! Don't forget to carry an umbrella to class."
            icon = "🌧️"
        elif weather_condition.lower() == "clouds":
            advice = "⛅ Overcast day on campus. Pleasant weather for walking between blocks!"
            icon = "⛅"
        elif temp >= 32:
            advice = "☀️ Hot day ahead! Keep a water bottle handy during lectures."
            icon = "☀️"

        return {
            "location": "VIT Bhopal Campus",
            "temp": temp,
            "condition": description,
            "humidity": humidity,
            "advice": advice,
            "icon": icon
        }
    except Exception as e:
        # Fallback response if offline or API request fails
        return {
            "location": "VIT Bhopal Campus",
            "temp": 28,
            "condition": "Partly Cloudy",
            "humidity": 65,
            "advice": "⛅ Enjoy your day on campus!",
            "icon": "⛅"
        }
# --- PDF SUMMARIZER ENDPOINT ---
@app.post("/api/summarize-notes")
async def summarize_notes(file: UploadFile = File(...)):
    try:
        content = await file.read()
        extracted_text = ""

        if file.filename.lower().endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        else:
            extracted_text = content.decode("utf-8", errors="ignore")

        if not extracted_text.strip():
            return {"summary": "Could not extract readable text from this file."}

        sentences = [s.strip() for s in extracted_text.split(".") if len(s.strip()) > 10]
        summary = ". ".join(sentences[:5]) + "." if sentences else "No key sentences found."

        return {"summary": summary}

    except Exception as e:
        return {"error": f"Failed to process file: {str(e)}"}


# --- TIMETABLE GENERATOR ENDPOINT ---
@app.get("/api/generate-schedule")
def generate_timetable():
    model = cp_model.CpModel()

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    time_slots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM']
    rooms = ['C-101', 'C-102', 'LAB-201']
    batches = ['CSE-AI-A', 'CSE-AI-B']
    teachers = ['Dr. Ramesh', 'Dr. Priya']

    assignments = {}
    for d in days:
        for s in time_slots:
            for r in rooms:
                for b in batches:
                    for t in teachers:
                        assignments[(d, s, r, b, t)] = model.NewBoolVar(f'assign_{d}_{s}_{r}_{b}_{t}')

    for d in days:
        for s in time_slots:
            for b in batches:
                model.AddAtMostOne(assignments[(d, s, r, b, t)] for r in rooms for t in teachers)

    for d in days:
        for s in time_slots:
            for r in rooms:
                model.AddAtMostOne(assignments[(d, s, r, b, t)] for b in batches for t in teachers)

    for d in days:
        for s in time_slots:
            for t in teachers:
                model.AddAtMostOne(assignments[(d, s, r, b, t)] for r in rooms for b in batches)

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    schedule = []
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for (d, s, r, b, t), var in assignments.items():
            if solver.Value(var) == 1:
                schedule.append({
                    "day": d,
                    "slot": s,
                    "room": r,
                    "batch": b,
                    "teacher": t
                })
        return {"status": "success", "data": schedule}
    else:
        return {"status": "error", "message": "No feasible timetable found."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)