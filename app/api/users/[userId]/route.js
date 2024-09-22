// /pages/api/users/[userId].js

import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient"; // Import your Supabase client

export async function GET(request) {
	const { userId } = request.query;

	if (!userId) {
		return NextResponse.json(
			{ error: "User ID is required." },
			{ status: 400 }
		);
	}

	try {
		// Fetch user from Supabase
		const { data: user, error: fetchError } = await supabase
			.from("users")
			.select("id, username, email, created_at, updated_at") // Add other fields if needed
			.eq("id", userId)
			.single();

		if (fetchError || !user) {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}

		return NextResponse.json({ user }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}
