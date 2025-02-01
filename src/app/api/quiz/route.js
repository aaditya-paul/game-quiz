export async function GET() {
  try {
    const response = await fetch("https://api.jsonserve.com/Uw5CrX");

    if (!response.ok) {
      return new Response(JSON.stringify({error: "Failed to fetch data"}), {
        status: 500,
      });
    }

    const data = await response.json();

    // Ensure data structure is valid
    if (!data.questions || !Array.isArray(data.questions)) {
      return new Response(JSON.stringify({error: "Invalid data format"}), {
        status: 400,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return new Response(JSON.stringify({error: "Internal Server Error"}), {
      status: 500,
    });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
