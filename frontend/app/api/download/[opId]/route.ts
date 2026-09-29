/**
 * Next.js App Router API route for /api/download/[opId]
 * Proxies binary file download requests to the FastAPI backend,
 * preserving Content-Disposition headers so browsers download correctly.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ opId: string }> }
) {
  try {
    const { opId } = await params;
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/download/${encodeURIComponent(opId)}`
    );

    if (!backendResponse.ok) {
      const body = await backendResponse.json().catch(() => null);
      return NextResponse.json(body ?? { detail: "Download failed" }, {
        status: backendResponse.status,
      });
    }

    // Stream the binary file back with the original headers
    const blob = await backendResponse.blob();
    const contentDisposition =
      backendResponse.headers.get("content-disposition") ?? "";
    const contentType =
      backendResponse.headers.get("content-type") ?? "application/octet-stream";

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("[/api/download proxy] Error:", error);
    return NextResponse.json({ detail: "Backend unreachable" }, { status: 503 });
  }
}
