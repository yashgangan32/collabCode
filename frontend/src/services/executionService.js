export const runCode = async (code) => {
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
      }),
    }
  );

  return response.json();
};