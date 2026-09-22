# KairoNote — Engineering Study Lab

> A private, local AI study companion built for Civil Engineering students using Tether QVAC.

KairoNote is an engineering-focused study application that combines local AI tutoring with practical engineering study tools.

It is designed to help students understand difficult concepts, practice engineering calculations, and study common Civil Engineering subjects while keeping AI inference on the user's machine.

## ✨ Features

### 🤖 Local AI Tutor

Ask questions about engineering, mathematics, physics, and other study topics.

KairoNote uses the QVAC JavaScript SDK to load a local language model and generate responses on-device.

### 🧮 Engineering Calculator

Perform common mathematical calculations directly inside the study interface.

### 📐 Statics Solver

Calculate the resultant of multiple forces using:

- Force magnitude
- Force direction
- X and Y components
- Resultant magnitude
- Resultant direction
- Quadrant identification
- Step-by-step solution

### ⚙️ Engineering Problem Solver

Solve supported engineering problems with deterministic calculations before using the local AI to explain the solution.

Example:

    A 10 kg box is pushed with a net force of 50 N.
    Find its acceleration.

    F = ma
    a = F / m
    a = 50 / 10
    a = 5.00 m/s²

### 📦 Free-Body Diagram Generator

Generate a simple horizontal-surface free-body diagram showing:

- Applied force
- Friction
- Normal force
- Weight
- Net force
- Resultant
- Acceleration

### 🔄 Unit Converter

Convert common engineering units including:

- meters
- centimeters
- millimeters
- kilometers
- feet
- inches

### 📚 Engineering Formula Toolbox

Quick reference for commonly used engineering formulas.

### 💻 KairoNote CLI

KairoNote can also run directly from the terminal without opening the website.

Run:

    npm run cli

Example:

    ========================================
            KAIRO NOTE — LOCAL AI
    ========================================

    QVAC model ready.
    KairoNote is running locally on this machine.

    You: What is Newton's Second Law?

    KairoNote:
    Newton's Second Law states that the net force
    on an object is equal to its mass multiplied
    by its acceleration.

## 🎓 Supported Study Areas

KairoNote currently provides an engineering-focused interface for subjects such as:

- General Engineering
- Statics & Mechanics
- Mathematics & Calculus
- Surveying
- Structural Engineering
- Hydraulics
- Building Utilities
- Engineering Economics

## 🔒 Local AI / Privacy

KairoNote is designed around local AI inference.

The application uses the QVAC SDK to load and run the language model locally on the user's machine.

The main AI flow is:

    Student
       ↓
    KairoNote
       ↓
    QVAC SDK
       ↓
    Local AI Model
       ↓
    AI Response

No external cloud AI API is required for the AI inference used by KairoNote.

## 🧠 QVAC Integration

KairoNote uses:

    @qvac/sdk 0.19.1

The application uses QVAC's:

- loadModel()
- completion()
- unloadModel()

The project uses the QVAC LLAMA_3_2_1B_INST_Q4_0 model.

QVAC provides the local AI inference layer, while KairoNote provides the engineering-focused study experience and tools.

## 🛠️ Tech Stack

- JavaScript
- Node.js
- HTML
- CSS
- Tether QVAC
- @qvac/sdk
- Local LLM inference

## 📁 Project Structure

    qvac-localstudylab/
    │
    ├── public/
    │   ├── index.html
    │   ├── style.css
    │   └── favicon.ico
    │
    ├── cli.js
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── README.md
    └── LICENSE

## 🚀 Installation

### Requirements

- Node.js
- npm
- Windows, macOS, or Linux
- Internet connection for the initial model download

After the model is downloaded and cached, QVAC can load it locally.

### 1. Clone the repository

    git clone https://github.com/troycablinga12-web/kaironote-qvac.git

### 2. Enter the project folder

    cd kaironote-qvac

### 3. Install dependencies

    npm install

## 🌐 Run the Web App

Start KairoNote:

    npm start

Then open:

    http://localhost:3000

The web application provides the full Engineering Study Lab interface.

## 💻 Run the CLI Version

KairoNote can also be used directly from the terminal:

    npm run cli

Ask questions directly in the terminal.

Type:

    exit

to close KairoNote.

## 🔧 How QVAC Works in KairoNote

When KairoNote starts, it loads the local model through QVAC.

The application then sends the student's question to QVAC's local completion system.

The generated response is streamed back to KairoNote.

When the application is stopped, the model can be unloaded.

This keeps the AI inference workflow local to the user's machine.

## 🎯 Project Goal

KairoNote was created as a student project to explore how local AI can be used to build practical educational tools.

The main goal is to create a useful AI study companion specifically for engineering students instead of a general-purpose chatbot.

Future improvements may include:

- More engineering problem types
- More formulas and references
- Dimension and unit checking
- Quiz mode
- Study history
- More Civil Engineering subjects
- Additional statics and mechanics tools

## 📸 Demo

KairoNote can be demonstrated through both:

1. The Engineering Study Lab web interface
2. The KairoNote terminal/CLI interface

The project demonstrates QVAC local model loading and AI completion running on the user's machine.

## 📄 License

This project is licensed under the MIT License.

See LICENSE for details.

## 🙏 Built With

Built using the Tether QVAC SDK.

- QVAC Documentation: https://docs.qvac.tether.io/
- QVAC GitHub: https://github.com/tetherto/qvac
- QVAC JavaScript SDK: https://www.npmjs.com/package/@qvac/sdk