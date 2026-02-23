# ApproveFlow Enterprise 🚀
**Automated Document Workflow & Digital Approval System**

ApproveFlow is a high-performance, full-stack enterprise solution designed to digitize organizational paper trails. It allows users to submit documents, routes them through multi-stage approval hierarchies, and generates secure, stamped PDFs upon final authorization.

---

## 🔗 Live Links
* **Live Application:** `https://approveflow-frontend.vercel.app`
* **API Documentation (Swagger):** `https://approveflow-api.onrender.com/docs`

---

## 🔑 Evaluation / Test Credentials
To evaluate the multi-user workflow and see how data transitions between roles, please use the following pre-configured accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@gmail.com` | `think@123` | System Config, Audit Logs, User Management |
| **HOD** | `carol@gmail.com` | `pass` | Approval Queue, Digital Signing |
| **Manager** | `bob@gmail.com` | `pass` | Approval Queue, Digital Signing |
| **Student / Staff** | `alice@gmail.com` | `pass` | Document Submission, Request Tracking |

> **Note:** Since the backend is hosted on a free tier, please allow **30-50 seconds** for the first login. This is due to the server "waking up" from inactivity.

---

## ✨ Core Features
* **Dynamic Workflows:** Create custom approval paths (e.g., Student → Tutor → HOD).
* **Automated PDF Generation:** The system generates a final PDF with approval stamps using `xhtml2pdf` upon final HOD authorization.
* **Secure Cloud Storage:** All documents are encrypted and stored in S3-compatible storage (Backblaze B2).
* **Real-time Audit Logs:** Every action—including logins, uploads, and approvals—is timestamped and logged for compliance.
* **Role-Based Access Control (RBAC):** Strict JWT-based security ensures users only interact with data relevant to their specific roles.

---

## 🛠️ Technical Stack
### **Backend**
* **Framework:** FastAPI (Python 3.10)
* **Database:** PostgreSQL (Hosted on Neon.tech)
* **ORM:** SQLAlchemy with declarative mapping
* **Storage:** S3-Compatible API via MinIO/Backblaze B2
* **Security:** OAuth2 with JWT Bearer tokens and Bcrypt password hashing

### **Frontend**
* **Library:** React 18 with TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS + Lucide Icons
* **State Management:** TanStack Query (React Query) & Axios

---

## 🏗️ Architecture
The system follows a modern decoupled architecture:
1.  **Client Layer:** React SPA deployed on Vercel.
2.  **API Layer:** FastAPI server on Render.com.
3.  **Data Layer:** PostgreSQL for relational data and Backblaze B2 for binary objects.



---

## 🚀 Local Development
1.  **Backend:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```
2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---
