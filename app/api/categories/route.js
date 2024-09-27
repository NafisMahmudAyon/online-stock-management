import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient";

export async function GET() {
	try {
		// Fetch all categories
		const { data, error } = await supabase.from("categories").select("*");

		if (error) {
			return NextResponse.json(
				{ error: "Failed to fetch categories." },
				{ status: 500 }
			);
		}

		return NextResponse.json({ categories: data }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}
