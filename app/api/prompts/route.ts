import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Prompt from "@/models/Prompt";
import { auth } from "@/auth";

// GET /api/prompts - List prompts with search, category filter, pagination
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { promptText: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const [prompts, total] = await Promise.all([
      Prompt.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Prompt.countDocuments(filter),
    ]);

    return NextResponse.json({
      prompts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

// POST /api/prompts - Create a new prompt (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { title, promptText, imageUrl, category, tags } = body;

    if (!promptText || !imageUrl) {
      return NextResponse.json(
        { error: "promptText and imageUrl are required" },
        { status: 400 }
      );
    }

    const prompt = await Prompt.create({
      title: title || undefined,
      promptText,
      imageUrl,
      category: category || undefined,
      tags: tags || [],
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}
