# Data Extraction Challenge: PDF to Structured JSON

## Recommended Libraries
- [MUPDF](https://www.npmjs.com/package/mupdf)


## Overview

The objective of this task is to develop a robust solution for extracting unstructured data from various PDF documents and transforming it into a strictly typed JSON format.

You are provided with three sample documents:

* `sc100.pdf`
* `sc101.pdf`
* `sc103.pdf`

The target schema for the output is defined in `sc100.ts`. Your goal is to map the data from the PDFs to this schema as accurately as possible.

---

## Getting Started

### Environment Setup

The development server is configured to run automatically upon workspace initialization. If you need to trigger it manually, use:

```bash
npm run dev
```

### Constraints & Scope

* **Flexibility:** You are encouraged to use any libraries, APIs (including LLMs), or heuristic-based parsing techniques you deem effective.
* **Accuracy vs. Completion:** While 100% extraction accuracy is the goal, we value the **logic and architecture** of your approach. If certain edge cases are tricky, document your thought process on how you'd solve them with more time.

---

## Project Structure

* `/data`: Contains the source PDF files.
* `/src/sc100.ts`: Contains `sc100.ts`, which defines the required JSON structure.
* `/src/index.ts`: This is where your core logic should reside.

---

## Evaluation Criteria

We will evaluate your submission based on:

1. **Code Quality:** Clean, readable, and maintainable TypeScript.
2. **Extraction Logic:** How you handle different PDF layouts and potential data inconsistencies.
3. **Error Handling:** How the system reacts when a PDF doesn't match the expected schema.
4. **Documentation:** A brief explanation of *why* you chose your specific approach.

---

## Submission

Please ensure your final JSON output files are saved in the `output/` directory and include a brief `SOLUTION.md` explaining your architectural choices and any trade-offs you made.

---