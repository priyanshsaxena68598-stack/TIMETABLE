import io
import requests
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from ortools.sat.python import cp_model

# 1. Initialize FastAPI app
app = FastAPI(title="SmartScheduler Backend")

# 2. Add CORS Middleware (allows React frontend on port 5173 / 5174 to talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenWeather API Settings
OPENWEATHER_API_KEY = "2fe49ef2c1702360ca168ea3786322a2"
CAMPUS_LAT = "23.0768"  # VIT Bhopal Campus coordinates
CAMPUS_LON = "76.8528"


# --- ENDPOINT 1: Weather Forecast & Campus Tips ---
@app.get("/api/weather")
def get_campus_weather():
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={CAMPUS_LAT}&lon={CAMPUS_LON}&appid={OPENWEATHER_API_KEY}&units=metric"
        res = requests.get(url).json()

        if res.get("cod") != 200:
            return {"error": "Unable to fetch weather data."}

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
        return {"error": str(e)}


# --- ENDPOINT 2: PDF & Document Revision Summarizer ---
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

        # Extract top key points from document
        sentences = [s.strip() for s in extracted_text.split(".") if len(s.strip()) > 10]
        summary = ". ".join(sentences[:5]) + "." if sentences else "No key sentences found."

        return {"summary": summary}

    except Exception as e:
        return {"error": f"Failed to process file: {str(e)}"}


# --- ENDPOINT 3: OR-Tools Timetable Generator ---
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

    # Constraint 1: A batch can have at most one class per time slot
    for d in days:
        for s in time_slots:
            for b in batches:
                model.AddAtMostOne(assignments[(d, s, r, b, t)] for r in rooms for t in teachers)

    # Constraint 2: A room can host at most one class per time slot
    for d in days:
        for s in time_slots:
            for r in rooms:
                model.AddAtMostOne(assignments[(d, s, r, b, t)] for b in batches for t in teachers)

    # Constraint 3: A teacher can teach at most one class per time slot
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


# Runner Entry Point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("scheduler:app", host="127.0.0.1", port=8000, reload=True)