/**
 * Next.js App Router API route for /api/decrypt
 * Proxies the multipart form-data request directly to the FastAPI backend.
 * This ensures binary .svault files are forwarded intact without any
 * transformation or buffering issues that can occur with rewrites.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  let backendResponse: Response;
  try {
    const formData = await request.formData();
    backendResponse = await fetch(`${BACKEND_URL}/api/decrypt`, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("[/api/decrypt proxy] Network/Connection Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Could not reach the SecureVault API. Start the app with ./start.sh from the project folder, then retry.",
        error_code: "NETWORK_ERROR",
      },
      { status: 503 }
    );
  }

  try {
    const data = await backendResponse.json();
    return NextResponse.json(data, {
      status: backendResponse.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (parseError) {
    console.error("[/api/decrypt proxy] JSON Parse Error:", parseError);
    const rawText = await backendResponse.text().catch(() => "");
    return NextResponse.json(
      {
        success: false,
        message: rawText || `Backend responded with HTTP status ${backendResponse.status}.`,
        error_code: "BACKEND_ERROR",
      },
      { status: backendResponse.status || 500 }
    );
  }
}
