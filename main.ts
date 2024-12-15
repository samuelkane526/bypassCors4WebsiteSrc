// @ts-ignore:next-line
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
// @ts-ignore:next-line
import puppeteer from "https://deno.land/x/puppeteer@14.1.1/mod.ts";

const handler = async (req) => {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("url");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (!targetUrl) {
    return new Response("URL parameter is required", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' //Change if needed
    });
    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    const content = await page.content();
    await browser.close();

    return new Response(content, {
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return new Response("Error fetching content", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
};

console.log("Server running on http://localhost:8000");
await serve(handler, { port: 8000 });
