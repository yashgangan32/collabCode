export const runCode = async (
  code,
  language
) => {
  const response = await fetch(
    "http://localhost:5000/api/run",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        code,
        language,
      }),
    }
  );

  return response.json();
};