import { supabase } from "@/utils/createClient"; // Assuming Supabase client is created
import { NextResponse } from "next/server";

export async function POST(request) {
	const { name, userId } = await request.json(); // Get shop name and userId from the request body

	if (!name) {
		return NextResponse.json(
			{ error: "Shop name is required." },
			{ status: 400 }
		);
	}

	if (!userId) {
		return NextResponse.json(
			{ error: "Unauthorized. You must be logged in to create a shop." },
			{ status: 401 }
		);
	}

	try {
		// Generate a unique slug for the shop
		const slug = `${name.toLowerCase().replace(/\s+/g, "-")}`;

		// Insert new shop into the database
		const { data, error } = await supabase
			.from("shops")
			.insert({
				owner_id: userId, // Use the userId passed from the frontend
				name,
				slug,
			})
			.select();

		if (error) {
			return NextResponse.json(
				{ error: "Failed to create the shop." },
				{ status: 500 }
			);
		}

		// Successfully created the shop
		return NextResponse.json({ shop: data[0] }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	const userId = request.headers.get("user-id"); // Get user ID from headers

	if (!userId) {
		return NextResponse.json(
			{ error: "Unauthorized. You must be logged in to view shops." },
			{ status: 401 }
		);
	}

	try {
		// Fetch shops where the user is either the owner or has some management role
		const { data, error } = await supabase
			.from("shops")
			.select("*")
			.or(`owner_id.eq.${userId}`);

		if (error) {
			return NextResponse.json(
				{ error: error  },
				{ status: 500 }
			);
		}

		return NextResponse.json({ shops: data }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}
