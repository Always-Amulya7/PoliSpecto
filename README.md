# PoliSpecto

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Genkit-1.14-FF6B6B?style=for-the-badge" alt="Genkit">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase">
</p>

PoliSpecto is an AI-powered document analysis platform designed to help teams extract insights from policy documents, contracts, and other text-based files. It leverages advanced Genkit AI flows to answer questions based on document content, manage document workflows, and provide analytics on document processing.

---

## ✨ Key Features

### 1. AI-Powered Document Q&A
- **Intelligent Answer Extraction**: Ask questions about any uploaded document and receive accurate answers.
- **Multi-Question Support**: Process multiple questions in a single request.
- **Follow-up Suggestions**: Get AI-generated follow-up questions based on your queries.

### 2. Document Management
- **Upload & Store**: Add documents via URL or direct PDF upload.
- **Search & Filter**: Quickly find documents by name.
- **Archive & Delete**: Manage document lifecycle with archival and deletion options.

### 3. Workflow & Approvals
- **Review System**: Approve or reject documents based on AI analysis.
- **Override Controls**: Manual override capability with reason tracking.
- **Status Tracking**: Monitor document status (Active, In Review, Approved, Rejected, Archived).

### 4. Team Collaboration
- **Role-Based Access**: Manage team members with Admin, Editor, and Viewer roles.
- **Invite System**: Add new team members with role assignment.
- **Activity Management**: View and manage team member activities.

### 5. Analytics Dashboard
- **Processing Metrics**: Track total documents, processing time, and monthly queries.
- **Visual Charts**: Bar and pie charts for document distribution and activity.
- **Recent Activity Log**: Detailed history of all document analyses.

### 6. Document Verification
- **Compliance Checking**: Verify documents against specific criteria using AI.
- **Validation Results**: Get structured verification results with reasons.

---

## 🏗️ Architecture

### Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS |
| **Components** | Radix UI + Shadcn/UI |
| **AI Engine** | Google Genkit |
| **Auth** | Firebase Authentication |
| **State** | React Context + LocalStorage |
| **Charts** | Recharts |

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── documents/         # Document management page
│   ├── analytics/         # Analytics dashboard
│   ├── team/              # Team management
│   ├── analysis/          # Individual analysis view
│   ├── settings/          # User settings
│   └── login/             # Authentication pages
├── components/            # React components
│   ├── ui/               # Reusable UI components (Shadcn)
│   ├── dashboard.tsx     # Main dashboard component
│   └── qna-form.tsx      # Q&A form component
├── ai/                    # Genkit AI flows
│   ├── flows/            # AI flow definitions
│   └── genkit.ts         # Genkit configuration
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (for authentication)
- Google AI API key (for Genkit)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PoliSpecto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google AI Configuration
   GOOGLE_GENAI_API_KEY=your_google_ai_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Run Genkit (for AI flows)**
   ```bash
   npm run genkit:dev
   ```

6. **Open in browser**
   Navigate to: `http://localhost:8000`

---

## 📖 Usage Guide

### Authentication
- Register a new account or log in with existing credentials.
- Firebase Authentication handles email/password sign-up and login.

### Asking Questions
1. Navigate to the dashboard.
2. Enter a document URL or upload a PDF.
3. Type your question about the document.
4. Click "Get Answer" to receive AI-generated insights.

### Managing Documents
1. Go to the **Documents** page.
2. Click "Upload Document" to add new documents.
3. Use the dropdown menu to analyze, archive, or delete documents.

### Team Management (Admin only)
1. Navigate to the **Team** page.
2. Click "Invite Member" to add new users.
3. Assign roles (Admin, Editor, Viewer) to manage permissions.

### Viewing Analytics
1. Go to the **Analytics** page.
2. View processing metrics, charts, and recent activity.

---

## 🔧 API Endpoints

### POST /api/v1/hackrx/run
Analyze documents and answer questions programmatically.

**Request:**
```json
{
  "documents": "https://example.com/policy.pdf",
  "questions": ["What is the remote work policy?", "How many days of leave?"]
}
```

**Headers:**
```
Authorization: Bearer <AUTH_TOKEN>
```

**Response:**
```json
{
  "answers": ["Answer 1", "Answer 2"]
}
```

---

## 🎨 Design System

### Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Deep Blue | #3F51B5 |
| Background | Light Gray | #ECEFF1 |
| Accent | Cyan | #00BCD4 |
| Dark Mode | Slate | - |

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold (700)
- **Body**: Regular (400)

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 8000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run genkit:dev` | Start Genkit dev server |
| `npm run genkit:watch` | Watch mode for Genkit |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Genkit](https://genkit.dev)
- [Firebase](https://firebase.google.com)
- [Radix UI](https://radix-ui.com)
- [Shadcn/UI](https://ui.shadcn.com)
