const testRequest = {
  input:
    "I am a field technician. A customer has no internet connection. I need an AI assistant that can help me troubleshoot the problem step by step, starting with basic checks and then moving to advanced diagnostics. It should keep the instructions practical and ask for the router model when device-specific commands are required.",
};

console.log("Sending request...\n");

const start = Date.now();

const response = await fetch("http://localhost:3000/api/agent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testRequest),
});

const elapsed = ((Date.now() - start) / 1000).toFixed(2);

if (!response.ok) {
  console.error("API request failed:", response.status);
  console.error(await response.text());
  process.exit(1);
}

const data = await response.json();

console.log(`Completed in ${elapsed}s\n`);
console.log("========== PROMPT GENERATOR ==========\n");
console.log(data.prompt);

console.log("\n========== DIAGNOSTIC AGENT ==========\n");
console.log(JSON.stringify(data.diagnosis, null, 2));

console.log("\n======================================\n");