import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const headers = request.nextUrl.searchParams.get("headers"); // Encoded JSON

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsedHeaders = headers ? JSON.parse(headers) : {};
    
    // Fetch the resource
    const response = await fetch(url, {
      headers: {
        ...parsedHeaders,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
        return new NextResponse(`Proxy error: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get("Content-Type");
    const data = await response.arrayBuffer();

    // CORS headers for our proxy response
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": contentType || "application/octet-stream",
    };

    // If it's an M3U8 playlist, we need to rewrite URLs
    // M3U8 MIME types: application/vnd.apple.mpegurl, application/x-mpegurl, audio/mpegurl
    if (contentType && (contentType.includes("mpegurl") || url.endsWith(".m3u8"))) {
      const text = new TextDecoder().decode(data);
      const baseUrl = new URL(url); // Base URL of the m3u8 file

      // Rewrite function
      const rewritten = text.replace(/^(?!#)(?!\s)(.+)$/gm, (match) => {
        let absoluteUrl = match;
        // Resolve relative URLs
        if (!match.startsWith("http")) {
            absoluteUrl = new URL(match, baseUrl.href).href;
        }
        
        // Encode for our proxy
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(absoluteUrl)}&headers=${encodeURIComponent(JSON.stringify(parsedHeaders))}`;
        return proxyUrl;
      });

      return new NextResponse(rewritten, {
        headers: corsHeaders,
      });
    }

    // For other files (TS segments, keys, etc.), just return the buffer
    return new NextResponse(data, {
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
