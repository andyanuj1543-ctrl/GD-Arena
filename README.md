# GD Arena

Group Discussion (GD) is one of the toughest rounds in campus placements, and almost no one can practice it properly. 

**GD Arena** is a voice-first web application designed to simulate real-life group discussions. It allows students to sit in a virtual room with a panel of AI-driven participants, each with distinct personalities, voices, and logical reasoning capabilities. It aims to recreate the chaotic, "fish market" dynamics of a real GD, helping students practice speaking up, making logical points, and handling interruptions.

## 🌟 Key Features

- **Live Voice Interactions**: Speak naturally using your microphone. The app transcribes your speech in real-time.
- **Dynamic Turn-taking & Interruptions**: Just like a real GD, if you start speaking, you can interrupt the AI participants mid-sentence.
- **Distinct AI Personalities**: Practice with diverse personalities like "The Assertive One", "The Analyst", "The Mediator", and more, each utilizing the Gemini API for unique perspectives and Text-to-Speech (TTS).
- **Custom Topics & Formats**: Choose from preset categories (Business, Technology, Abstract, Controversial) or enter your own custom topic.
- **Cinematic UI**: A clean, modern "Harvard seminar room meets Notion" aesthetic that keeps you focused on the discussion.
- **Post-GD Report**: (WIP/Architecture planned) Get specific feedback on your speaking time, logical points, and areas for improvement.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Socket.IO Client, Web Speech API (for real-time STT).
- **Backend**: Node.js, Express, Socket.IO, `@google/genai` (Gemini API for Text Generation and TTS).
- **Architecture**: Monorepo setup with concurrently running frontend and backend servers.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/andyanuj1543-ctrl/GD-Arena.git
   cd GD-Arena
   ```

2. **Install dependencies:**
   Run the following command in the root directory to install dependencies for both the root, client, and server:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   CORS_ORIGIN=http://localhost:5174
   ```

4. **Run the Application:**
   Start both the frontend and backend development servers concurrently:
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to `http://localhost:5174` in your Chrome/Edge browser.
   
   *(Note: When prompted, you must allow Microphone permissions in your browser for the voice features to work).*

## 🧠 How it Works Under the Hood

- **Audio Flow**: The frontend utilizes the browser's native `SpeechRecognition` API to transcribe student speech. When a final phrase is recognized, it's sent to the Node.js server via WebSockets.
- **AI Orchestration**: The `DiscussionOrchestrator` on the backend manages the state of the room, tracking the timer, phases (Opening, Discussion, Closing), and turn logic.
- **Voice Synthesis**: The backend leverages `gemini-3.8-flash` for generating context-aware dialogue and `gemini-3.8-flash-tts` for generating the raw audio buffers, which are streamed back to the client and played sequentially via the Web Audio API.

## 📝 License
MIT License
