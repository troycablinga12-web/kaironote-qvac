import readline from "node:readline";

import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

let modelId = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "You: "
});

async function startKairoNote() {
  console.log("");
  console.log("========================================");
  console.log("        KAIRO NOTE — LOCAL AI");
  console.log("========================================");
  console.log("");
  console.log("Loading QVAC model locally...");

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (progress) => {
      if (typeof progress?.percentage === "number") {
        process.stdout.write(
          `\rLoading model: ${progress.percentage.toFixed(0)}%`
        );
      }
    }
  });

  console.log("\n");
  console.log("QVAC model ready.");
  console.log("KairoNote is running locally on this machine.");
  console.log("");
  console.log("Ask me anything about your studies.");
  console.log('Type "exit" to quit.');
  console.log("");

  rl.prompt();
}

async function askKairoNote(question) {
  const prompt = `You are KairoNote, a private on-device AI study companion for Civil Engineering students.

Student question:
${question}

Answer using simple English.

Rules:
- Answer the question directly.
- Explain difficult topics clearly.
- For mathematics, physics, statics, and engineering problems, show the correct formula and calculation when needed.
- Never invent given values.
- Never change numbers provided by the student.
- Always include correct units.
- If information is genuinely missing, say what is missing.
- Keep the answer concise but useful.
- Sound like a helpful college tutor.
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

  process.stdout.write("\nKairoNote:\n");

  for await (const token of run.tokenStream) {
    process.stdout.write(token);
  }

  await run.final;

  console.log("\n");
}

rl.on("line", async (input) => {
  const question = input.trim();

  if (!question) {
    rl.prompt();
    return;
  }

  if (question.toLowerCase() === "exit") {
    console.log("\nClosing KairoNote...");

    if (modelId) {
      await unloadModel({ modelId }).catch(() => {});
    }

    rl.close();
    process.exit(0);
  }

  try {
    rl.pause();

    await askKairoNote(question);

    rl.resume();
    rl.prompt();
  } catch (error) {
    console.error("\nError:", error.message);
    rl.resume();
    rl.prompt();
  }
});

startKairoNote().catch(async (error) => {
  console.error("\nFailed to start KairoNote:", error.message);

  if (modelId) {
    await unloadModel({ modelId }).catch(() => {});
  }

  rl.close();
  process.exit(1);
});