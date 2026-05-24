import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const reports = await db.report.findMany({
      select: {
        id: true,
        slug: true,
        objectName: true,
        summaryText: true,
        imageB64: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve archive." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const authHeader = request.headers.get("Authorization") || "";
    const password = authHeader.replace(/^Bearer\s+/i, "");

    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
    }

    await db.report.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete report:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete report." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
