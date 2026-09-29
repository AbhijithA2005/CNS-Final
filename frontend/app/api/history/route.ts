/**
 * Generic GET proxy for /api/history with query string forwarding
 */
import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.search;
    const res = await fetch(`${BACKEND_URL}/api/history${search}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 503 });
  }
}
