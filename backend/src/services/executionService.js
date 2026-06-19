import { exec } from "child_process";
import fs from "fs/promises";

export const executeJavaScript = async (
  code
) => {
  const fileName = "temp.js";

  try {
    await fs.writeFile(fileName, code);

    return await new Promise(
      (resolve, reject) => {
        exec(
          `node ${fileName}`,
          {
            timeout: 5000,
          },
          (error, stdout, stderr) => {
            if (error) {
              return reject(
                stderr || error.message
              );
            }

            resolve(stdout);
          }
        );
      }
    );
  } finally {
    try {
      await fs.unlink(fileName);
    } catch {}
  }
};