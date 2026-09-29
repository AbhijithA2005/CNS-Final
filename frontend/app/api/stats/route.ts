/**
 * Generic GET proxy for /api/stats
 */
import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
export async function GET(_request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/stats`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 503 });
  }
}
