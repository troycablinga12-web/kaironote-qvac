# KairoNote

KairoNote is a private AI study companion powered by Tether QVAC.

It helps students understand lessons through simple explanations, examples, quizzes, and common-mistake guidance. AI inference runs locally on the user's machine using the QVAC SDK.

## Features

- Explain difficult topics in simple English
- Generate examples
- Quiz the student
- Identify common mistakes
- On-device AI inference
- No API key required
- No cloud AI calls
- Simple browser-based interface

## Built With

- Node.js
- JavaScript
- HTML/CSS
- Tether QVAC SDK
- `@qvac/sdk` version `0.19.1`

## How It Works

The browser sends the student's question to the local Node.js server.

The server uses QVAC to load the local AI model and generate the response.

```text
Student
   ↓
KairoNote Web Interface
   ↓
Local Node.js Server
   ↓
Tether QVAC
   ↓
Local AI Model
   ↓
AI Response
## Development Notes

KairoNote was developed as an original student-focused project to demonstrate practical on-device AI.

The application keeps the AI inference process on the user's machine and provides a simple interface designed for everyday studying.