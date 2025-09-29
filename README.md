# AI-Powered Appointment Scheduler

This is a backend service that functions as an AI-powered assistant to parse natural language appointment requests and convert them into structured scheduling data. The system is designed to handle both typed text and images of notes, making it a versatile scheduling tool.

---
## ## Key Features

* **Dual Input Modes:** Accepts appointment requests via direct text input (`application/json`) or image uploads (`multipart/form-data`).
* **OCR for Images:** Utilizes **Tesseract.js** for accurate Optical Character Recognition (OCR) to extract text from image files like scanned notes or photos.
* **Natural Language Processing:**
    * **Entity Extraction:** Intelligently extracts key entities such as the `department`, `date_phrase`, and `time_phrase` from the raw text.
    * **Normalization:** Converts natural language date/time phrases (e.g., "next Friday at 3pm") into a standardized ISO 8601 date/time format, localized to the `Asia/Kolkata` timezone.
* **Structured JSON Output:** The final output is a clean, structured JSON object, perfect for integration with calendars, databases, or frontend applications.
* **Ambiguity Handling:** Includes built-in guardrails to detect unclear requests. If a department or date/time cannot be determined, it returns a helpful clarification message.

---
## ## Architecture

The service is built with Node.js and follows a simple pipeline architecture:



1.  **API Layer (Express & Multer):** An endpoint at `/api/schedule` accepts `POST` requests. **Multer** middleware processes any `image` file uploads.
2.  **Controller:** This is the orchestrator. It receives the request, determines if the input is text or an image, and passes the data to the appropriate service.
3.  **OCR Service (Tesseract.js):** If an image is provided, this service is called to perform OCR and extract the raw text content.
4.  **NLP Service (Chrono-node):** This core service takes the raw text and performs both entity extraction and normalization to find the department and the exact appointment time.
5.  **JSON Response:** The controller sends the final structured appointment data or a clarification request back to the client.

---
## ## Tech Stack

| Category            | Technology                  | Reason for Choice                                                                            |
| ------------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| **Backend** | **Node.js**, **Express.js** | Non-blocking, event-driven architecture is perfect for an efficient, I/O-based API server.     |
| **OCR** | **Tesseract.js** | A powerful and popular OCR engine that can be run directly within the Node.js environment.     |
| **NLP (Date Parsing)**| **Chrono-node** | Excellent library for parsing a wide variety of natural language date and time formats.        |
| **File Uploads** | **Multer** | The standard, efficient middleware for handling `multipart/form-data` in Express.          |

---
## ## Setup and Installation

To run this project locally, follow these steps:

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd ai-appointment-scheduler
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
    *Note: `tesseract.js` may download language training data on the first run, which can take a few minutes.*

4.  Start the development server:
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:3000`.

---
## ## API Usage

The service has a single endpoint for all scheduling requests.

**Endpoint:** `POST /api/schedule`

### **Example 1: Scheduling with Text**

**cURL Request:**
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"text": "Book dentist next Friday at 3pm"}' \
http://localhost:3000/api/schedule
```

**Success Response (`200 OK`):**
```json
{
    "appointment": {
        "department": "Dentistry",
        "date": "2025-10-10",
        "time": "15:00",
        "tz": "Asia/Kolkata",
        "status": "ok"
    }
}
```

### **Example 2: Scheduling with an Image**

**cURL Request:**
*Replace `/path/to/your/note.png` with the actual path to your image file.*
```bash
curl -X POST -F "image=@/path/to/your/note.png" http://localhost:3000/api/schedule
```

### **Example 3: Ambiguous Request**

**cURL Request:**
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"text": "I need an appointment with the heart doctor"}' \
http://localhost:3000/api/schedule
```

**Clarification Response (`422 Unprocessable Entity`):**
```json
{
    "status": "needs clarification",
    "message": "Ambiguous date/time. Please be more specific."
}
```
