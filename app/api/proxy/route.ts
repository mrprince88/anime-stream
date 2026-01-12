import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const headers = request.nextUrl.searchParams.get("headers"); // Encoded JSON

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsedHeaders = headers ? JSON.parse(headers) : {};
    
    // Check for Range header to support seeking
    const range = request.headers.get("range");
    const fetchHeaders: Record<string, string> = {
        ...parsedHeaders,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    };
    if (range) {
        fetchHeaders["Range"] = range;
    }

    // Fetch the resource
    const response = await fetch(url, {
      headers: fetchHeaders,
    });

    if (!response.ok) {
        return new NextResponse(`Proxy error: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get("Content-Type");
    
    // CORS headers for our proxy response
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Range",
      "Content-Type": contentType || "application/octet-stream",
    };

    // If it's an M3U8 playlist, we need to rewrite URLs
    // M3U8 MIME types: application/vnd.apple.mpegurl, application/x-mpegurl, audio/mpegurl
    if (contentType && (contentType.includes("mpegurl") || url.endsWith(".m3u8"))) {
      const text = await response.text();
      const baseUrl = new URL(url); // Base URL of the m3u8 file

      // Rewrite function
      // Rewrite standard URLs (lines not starting with #)
      let rewritten = text.replace(/^(?!#)(?!\s)(.+)$/gm, (match) => {
        let absoluteUrl = match.trim();
        // Resolve relative URLs
        if (!absoluteUrl.startsWith("http")) {
            absoluteUrl = new URL(absoluteUrl, baseUrl.href).href;
        }
        
        // Encode for our proxy
        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}&headers=${encodeURIComponent(JSON.stringify(parsedHeaders))}`;
      });

      // Rewrite URI="..." attributes in tags (e.g. #EXT-X-I-FRAME-STREAM-INF:URI="...")
      rewritten = rewritten.replace(/URI="([^"]+)"/g, (match, uri) => {
        let absoluteUrl = uri.trim();
        if (!absoluteUrl.startsWith("http")) {
            absoluteUrl = new URL(absoluteUrl, baseUrl.href).href;
        }
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(absoluteUrl)}&headers=${encodeURIComponent(JSON.stringify(parsedHeaders))}`;
        return `URI="${proxyUrl}"`;
      });

      return new NextResponse(rewritten, {
        headers: corsHeaders,
      });
    }

    // For other files (TS segments, keys, etc.), stream the response directly
    // Forward important headers for streaming/seeking
    const responseHeaders = new Headers(corsHeaders);
    if (response.headers.has("Content-Length")) {
        responseHeaders.set("Content-Length", response.headers.get("Content-Length")!);
    }
    if (response.headers.has("Content-Range")) {
        responseHeaders.set("Content-Range", response.headers.get("Content-Range")!);
    }
    if (response.headers.has("Accept-Ranges")) {
        responseHeaders.set("Accept-Ranges", response.headers.get("Accept-Ranges")!);
    }

    return new NextResponse(response.body, {
        status: response.status,
        headers: responseHeaders,
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
