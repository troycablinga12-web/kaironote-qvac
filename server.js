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


/* =========================================
   JSON RESPONSE
========================================= */

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify(data));
}


/* =========================================
   READ REQUEST BODY
========================================= */

async function readBody(req) {
  let body = "";

  for await (const chunk of req) {
    body += chunk;
  }

  return JSON.parse(body || "{}");
}


/* =========================================
   LOAD QVAC MODEL
========================================= */

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
  console.log(
    "KairoNote is ready — inference stays on this machine."
  );
}


/* =========================================
   AI ANSWER
========================================= */

async function answer(question, mode) {

  const prompt = `
You are KairoNote, a private on-device AI tutor designed mainly for Civil Engineering students.

SUBJECT / STUDENT REQUEST:
${question}

TASK MODE:
${mode}

Your job is to answer ONLY what the student actually asks.

IMPORTANT ACCURACY RULES:
- Read the entire student request carefully.
- Never invent numbers, formulas, measurements, or given information.
- Never change a number given by the student.
- Never assume a numerical value unless it is clearly stated or is a standard constant that obviously applies.
- If the student asks you to calculate an unknown, use the information given to calculate it.
- Do NOT say information is missing when the requested value is simply the unknown.
- Clearly distinguish force, mass, acceleration, velocity, speed, distance, time, pressure, stress, strain, moment, area, and volume.
- Always check arithmetic before giving a numerical answer.
- Always include units.
- If information is genuinely missing, say exactly what is missing.
- If you make an assumption, clearly label it as an assumption.
- Never invent a diagram or force direction that the student did not provide.

ENGINEERING SOLUTION FORMAT:
When solving a numerical engineering problem, use:

GIVEN:
List the known values.

FIND:
State the unknown.

FORMULA:
Write the correct formula.

SOLUTION:
Substitute the given values and calculate step by step.

FINAL ANSWER:
Give the final answer with the correct unit.

For simple conceptual questions, you do not need to force this format.

NEWTON'S SECOND LAW:
Use:
F_net = m × a

Therefore:
a = F_net / m
F_net = m × a
m = F_net / a

Do NOT confuse acceleration with speed.

STATICS:
For concurrent force problems:
Fx = F cos(θ)
Fy = F sin(θ)

ΣFx = sum of all x-components
ΣFy = sum of all y-components

Resultant:
R = √[(ΣFx)² + (ΣFy)²]

Direction:
θ = atan2(ΣFy, ΣFx)

Angles are measured counterclockwise from the positive x-axis unless the student specifies another convention.

For equilibrium:
ΣFx = 0
ΣFy = 0
ΣM = 0

Be careful with force direction, signs, quadrants, angles, and components.

MOMENTS:
M = Fd

NORMAL STRESS:
σ = F/A

DENSITY:
ρ = m/V

TASK MODES:

If mode is "Explain it":
Explain the concept simply with a short example when useful.

If mode is "Give me an example":
Create a realistic engineering example and solve it correctly.

If mode is "Solve this problem":
Give a structured solution using GIVEN, FIND, FORMULA, SOLUTION, and FINAL ANSWER.

If mode is "Quiz me":
Ask one short question and wait for the student's answer.
Do not reveal the answer immediately.

If mode is "Find my common mistake":
Identify the likely mistake and explain the correct method.

STYLE:
- Use simple English.
- Sound like a helpful college tutor.
- Be natural.
- Do not use unnecessarily deep words.
- Keep explanations concise.
- Use short steps.
- Do not repeat the same information.
- Never claim to browse the web.
- Never claim to use cloud AI.
- Keep the answer under 220 words.

IMPORTANT:
If the student asks a direct question, answer that exact question instead of changing the topic.
`;

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


/* =========================================
   HTTP SERVER
========================================= */

const server = http.createServer(async (req, res) => {

  try {

    /* =====================================
       AI REQUEST
    ===================================== */

    if (
      req.method === "POST" &&
      req.url === "/api/ask"
    ) {

      const {
        question,
        mode = "Explain it"
      } = await readBody(req);


      if (!question?.trim()) {

        return sendJson(res, 400, {
          error: "Enter a question first."
        });

      }


      const result = await answer(
        question.trim(),
        mode
      );


      /*
        IMPORTANT:
        The frontend expects "answer".
        Previously the server returned "result",
        which caused the UI to display undefined.
      */

      return sendJson(res, 200, {
        answer: result
      });
    }


    /* =====================================
       STATIC FILES
    ===================================== */

    if (req.method === "GET") {

      const requested =
        req.url === "/"
          ? "/index.html"
          : req.url.split("?")[0];


      const safe = path
        .normalize(requested)
        .replace(/^([.][.][\\/])+/, "");


      const file = path.join(
        publicDir,
        safe
      );


      const data = await fs.readFile(file);


      let type =
        "text/plain; charset=utf-8";


      if (file.endsWith(".html")) {

        type =
          "text/html; charset=utf-8";

      } else if (file.endsWith(".css")) {

        type =
          "text/css; charset=utf-8";

      } else if (file.endsWith(".js")) {

        type =
          "application/javascript; charset=utf-8";

      } else if (file.endsWith(".json")) {

        type =
          "application/json; charset=utf-8";
      }


      res.writeHead(200, {
        "Content-Type": type
      });


      return res.end(data);
    }


    /* =====================================
       NOT FOUND
    ===================================== */

    res.writeHead(404);
    res.end("Not found");


  } catch (error) {

    console.error(error);


    sendJson(res, 500, {
      error:
        error.message ||
        "Something went wrong."
    });

  }
});


/* =========================================
   CLEAN SHUTDOWN
========================================= */

process.on("SIGINT", async () => {

  console.log("\nStopping KairoNote...");


  if (modelId) {

    await unloadModel({
      modelId
    }).catch(() => {});

  }


  process.exit(0);
});


/* =========================================
   START
========================================= */

await loadLocalModel();


server.listen(PORT, () => {

  console.log(
    `KairoNote running at http://localhost:${PORT}`
  );

});