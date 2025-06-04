export async function GET() {
  // For now, return a static array of 4–5 pairs.
  const questions = [
    { left: "Vim", right: "VSCode" },
    { left: "JavaScript", right: "TypeScript" },
    { left: "C", right: "Rust" },
    { left: "React", right: "Angular" },
    { left: "Node.js", right: "Deno" },
  ];

  return new Response(JSON.stringify({ questions }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
