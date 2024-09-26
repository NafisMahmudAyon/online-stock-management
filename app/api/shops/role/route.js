import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient"; // Ensure to configure Supabase client

export async function POST(request) {
	const { shopId, email, role } = await request.json();

	// Validate required fields
	if (!shopId || !email || !role) {
		return NextResponse.json(
			{ error: "Shop ID, email, and role are required." },
			{ status: 400 }
		);
	}

	// Check if the role is valid
	const validRoles = ["owner", "manager", "staff"];
	if (!validRoles.includes(role)) {
		return NextResponse.json(
			{ error: "Invalid role. Role must be 'owner', 'manager', or 'staff'." },
			{ status: 400 }
		);
	}

	try {
		// Fetch the user by email
		const { data: user, error: userError } = await supabase
			.from("users")
			.select("id")
			.eq("email", email)
			.single();

		let userId = null;

		// Check if user exists
		if (userError || !user) {
			// If user not found, userId remains null
			console.warn("User not found, proceeding without user ID.");
		} else {
			userId = user.id;
		}

		// Check if the user (if exists) already has a role in the shop
		if (userId) {
			const { data: existingRole, error: existingError } = await supabase
				.from("shop_user_roles")
				.select("*")
				.eq("shop_id", shopId)
				.eq("user_id", userId)
				.single();

			if (existingRole) {
				return NextResponse.json(
					{ error: "User already has a role in this shop." },
					{ status: 409 }
				);
			}
		}

		// Insert the new role for the user in the shop
		const { data, error } = await supabase
			.from("shop_user_roles")
			.insert({
				shop_id: shopId,
				user_id: userId, // This could be null if the user does not exist
				user_email: email,
				role: role,
			})
			.select();

		if (error) {
			return NextResponse.json(
				{ error: "Failed to assign role." },
				{ status: 500 }
			);
		}

		// Return success response
		return NextResponse.json(
			{ message: "Role assigned successfully", data: data[0] },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}
