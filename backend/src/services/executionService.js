import { exec } from "child_process";
import fs from "fs/promises";
import crypto from "crypto";
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { timeout: 5000 },
      (error, stdout, stderr) => {
        if (error) {
          return reject(
            stderr || error.message
          );
        }

        resolve(stdout);
      }
    );
  });
};

export const executeCode = async (
  code,
  language
) => {
  let fileName = "";
  let command = "";
  const executionId = crypto.randomUUID();

  switch (language) {
    case "javascript":
      fileName = `temp-${executionId}.js`;
      command = `node ${fileName}`;
      break;

    case "python":
      fileName = `temp-${executionId}.py`;
      command = `python3 ${fileName}`;
      break;

    case "cpp":
      fileName = `temp-${executionId}.cpp`;

      command =
        `g++ ${fileName} -o temp-${executionId} && ./temp-${executionId}`;

      break;

    default:
      throw new Error(
        "Unsupported language"
      );
  }

  try {
    await fs.writeFile(
      fileName,
      code
    );

    return await runCommand(
      command
    );
  } finally {
    try {
      await fs.unlink(fileName);
    } catch { }

    if (language === "cpp") {
      try {
        await fs.unlink(
          `temp-${executionId}`
        );
      } catch { }
    }
  }
};