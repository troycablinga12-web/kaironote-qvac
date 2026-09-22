import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "public");
const PORT = 3000;

let modelId = null;

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify(data));
}

async function readBody(req) {
  let body = "";

  for await (const chunk of req) {
    body += chunk;
  }

  return JSON.parse(body || "{}");
}

async function loadLocalModel() {
  console.log("Loading QVAC model locally...");

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (progress) => {
      if (typeof progress?.percentage === "number") {
        console.log(
          `Downloading model: ${progress.percentage.toFixed(0)}%`
        );
      }
    }
  });

  console.log("QVAC model ready.");
  console.log("Inference stays on this machine.");
}

async function answer(question, mode) {
  const prompt = `You are KairoNote, a private on-device AI study companion for students.

Task mode: ${mode}
Student request: ${question}

Give a clear and accurate answer using simple English.

IMPORTANT:
- Never invent or mix up numerical values.
- For formulas, write the correct formula and explain what each variable means.
- If you give a numerical example, calculate it correctly.
- Make sure all units are consistent.
- For Newton's Second Law, use F_net = m × a and clearly distinguish force, mass, and acceleration.
- If there is not enough information to calculate something, explicitly say what information is missing.
- For mathematics, physics, statics, engineering, or other technical topics, show the important steps when calculations are needed.
- For quizzes, ask a short question and wait for the student's answer.
- For examples, make the example realistic and mathematically correct.
- For common mistakes, explain the mistake briefly and show the correct approach.
- Do not claim to browse the web.
- Do not use cloud AI.
- Keep the response under 180 words.`;

  const run = completion({
    modelId,
    history: [
      {
        role: "user",
        content: prompt
      }
    ],
    stream: true
  });

  let text = "";

  for await (const token of run.tokenStream) {
    text += token;
  }

  await run.final;

  return text.trim();
}

const server = http.createServer(async (req, res) => {
  try {
    // AI request
    if (req.method === "POST" && req.url === "/api/ask") {
      const { question, mode = "explain" } = await readBody(req);

      if (!question?.trim()) {
        return sendJson(res, 400, {
          error: "Enter a question first."
        });
      }

      const result = await answer(
        question.trim(),
        mode
      );

      return sendJson(res, 200, {
        result
      });
    }

    // Serve website files
    if (req.method === "GET") {
      const requested =
        req.url === "/" ? "/index.html" : req.url;

      const safe = path
        .normalize(requested)
        .replace(/^([.][.][\\/])+/, "");

      const file = path.join(publicDir, safe);
      const data = await fs.readFile(file);

      let type = "text/plain; charset=utf-8";

      if (file.endsWith(".html")) {
        type = "text/html; charset=utf-8";
      } else if (file.endsWith(".css")) {
        type = "text/css; charset=utf-8";
      } else if (file.endsWith(".js")) {
        type = "application/javascript; charset=utf-8";
      } else if (file.endsWith(".json")) {
        type = "application/json; charset=utf-8";
      }

      res.writeHead(200, {
        "Content-Type": type
      });

      return res.end(data);
    }

    res.writeHead(404);
    res.end("Not found");

  } catch (error) {
    console.error(error);

    sendJson(res, 500, {
      error: error.message || "Something went wrong."
    });
  }
});

// Cleanly unload QVAC when the app stops
process.on("SIGINT", async () => {
  console.log("\nStopping KairoNote...");

  if (modelId) {
    await unloadModel({ modelId }).catch(() => {});
  }

  process.exit(0);
});

// Load QVAC first, then start the website
await loadLocalModel();

server.listen(PORT, () => {
  console.log(`KairoNote running at http://localhost:${PORT}`);
});