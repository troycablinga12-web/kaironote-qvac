# LocalStudyLab

A small private study coach powered by **Tether QVAC**. Ask a study question and get a short explanation, example, quiz, or common-mistake check. The QVAC language model runs locally on the same machine as the app.

## Why it is different

LocalStudyLab is designed for students who may want to paste their own class notes or questions into an AI tool without sending them to a remote AI API. This demo keeps inference local and needs no API key.

## QVAC requirement

- SDK: `@qvac/sdk` **0.19.1**
- QVAC functions used: `loadModel()` and `completion()`
- Model: `LLAMA_3_2_1B_INST_Q4_0`

QVAC 0.19.x runs models locally; delegated/provider inference was removed in 0.19.0.

## Requirements

- Node.js 22.17+ recommended
- npm 10.9+
- A machine supported by QVAC with enough memory for the model

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Open **http://localhost:3000** in your browser. The first run downloads the model; later runs can reuse the local model cache.

## How it works

The browser sends the question only to the local Node.js app at `localhost`. The Node process calls QVAC's `loadModel()` once, then uses `completion()` for each question. There is no external AI API in this app.

## Open source

MIT License. See `LICENSE`.

## Credits

Built with the open-source QVAC SDK by Tether: https://github.com/tetherto/qvac
