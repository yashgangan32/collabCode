import { executeJavaScript } from "../services/executionService.js";

export const runCode = async (
  req,
  res
) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        output: "Code is required",
      });
    }

    const output =
      await executeJavaScript(code);

    return res.json({
      success: true,
      output,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      output: String(error),
    });
  }
};