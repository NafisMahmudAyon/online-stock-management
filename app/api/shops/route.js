import { supabase } from "@/utils/createClient"; // Assuming Supabase client is created
import { NextResponse } from "next/server";

export async function POST(request) {
	const { name, userId, userEmail } = await request.json(); // Get shop name and userId from the request body

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

	// Start a transaction
	// const transaction = supabase.transaction();

	try {
		// Generate a unique slug for the shop
		const slug = `${name.toLowerCase().replace(/\s+/g, "-")}`;

		// Insert new shop into the database
		const { data: shopData, error: shopError } = await supabase
			.from("shops")
			.insert({
				owner_id: userId, // Use the userId passed from the frontend
				name,
				slug,
			})
			.select();

		if (shopError) {
			// Rollback if shop creation fails
			// await transaction.rollback();
			return NextResponse.json(
				{ error: "Failed to create the shop." },
				// { error: shopError.message },
				{ status: 500 }
			);
		}
		console.log(shopData);
		const shop = shopData[0];

		// Insert the owner's role into shop_user_roles table
		const { error: roleError } = await supabase.from("shop_user_roles").insert({
			shop_id: shop.id, // Reference the created shop ID
			user_id: userId,
			user_email: userEmail,
			role: "owner", // Assign the owner role
		});

		if (roleError) {
			// Rollback the transaction if assigning the role fails
			// await transaction.rollback();
			return NextResponse.json(
				{ error: "Failed to assign owner role to the user." },
				{ status: 500 }
			);
		}

		// Commit the transaction if both operations succeed
		// await transaction.commit();

		// Successfully created the shop and assigned the role
		return NextResponse.json({ shop }, { status: 201 });
	} catch (error) {
		// Rollback in case of any other errors
		// await transaction.rollback();
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}

// export async function GET(request) {
// 	const userId = request.headers.get("user-id"); // Get user ID from headers

// 	if (!userId) {
// 		return NextResponse.json(
// 			{ error: "Unauthorized. You must be logged in to view shops." },
// 			{ status: 401 }
// 		);
// 	}

// 	try {
// 		// Fetch shops where the user is either the owner or has some management role
// 		const { data, error } = await supabase
// 			.from("shops")
// 			.select("*")
// 			.or(`owner_id.eq.${userId}`);

// 		if (error) {
// 			return NextResponse.json(
// 				{ error: error  },
// 				{ status: 500 }
// 			);
// 		}

// 		return NextResponse.json({ shops: data }, { status: 200 });
// 	} catch (error) {
// 		return NextResponse.json(
// 			{ error: "Internal Server Error", details: error.message },
// 			{ status: 500 }
// 		);
// 	}
// }

export async function GET(request) {
	const userEmail = request.headers.get("user-email"); // Get user ID from headers

	if (!userEmail) {
		return NextResponse.json(
			{ error: "Unauthorized. You must be logged in to view shops." },
			{ status: 401 }
		);
	}

	try {
		// Fetch shops where the user is either the owner or has a role (owner, manager, or staff) in the shop_user_roles table
		const { data, error } = await supabase
			.from("shops")
			.select("*, shop_user_roles!inner(role)")
			.eq("shop_user_roles.user_email", userEmail);

		if (error) {
			return NextResponse.json(
				{ error: "Failed to fetch shops." },
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