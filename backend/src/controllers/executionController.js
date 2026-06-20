import { executeCode } from "../services/executionService.js";

export const runCode = async (
  req,
  res
) => {
  try {
    const {
      code,
      language,
    } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        output: "Code is required",
      });
    }
    console.log(req.body);
    const output =
      await executeCode(
        code,
        language
      );

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