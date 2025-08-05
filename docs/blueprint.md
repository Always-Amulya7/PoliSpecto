# **App Name**: PolicyQnA

## Core Features:

- Document & Question Intake: Accepts a PDF document URL and questions via a POST request.
- PDF Parsing & Chunking: Parses the PDF document, extracts text, and splits it into semantic chunks.
- Embedding Generation: Generates embeddings for document chunks using OpenAI Embeddings and stores them.
- Context Retrieval: Retrieves relevant document chunks based on question embeddings.
- Answer Extraction via LLM: Uses GPT-4 tool to extract answers from retrieved document chunks.
- JSON Output: Returns answers as a structured JSON array.
- Authentication: Implements Bearer token authentication for secure access.

## Style Guidelines:

- Primary color: Deep Blue (#3F51B5) to convey trust and professionalism.
- Background color: Light Gray (#ECEFF1), nearly desaturated blue, for a clean and modern look.
- Accent color: Cyan (#00BCD4), an analogous color to the primary, to highlight key actions and elements.
- Body and headline font: 'Inter', a sans-serif font known for its legibility and modern aesthetic.
- Use simple, outline-style icons to represent different document types and actions.
- Maintain a clean and structured layout for easy navigation and readability.
- Subtle animations and transitions to provide a smooth and engaging user experience.