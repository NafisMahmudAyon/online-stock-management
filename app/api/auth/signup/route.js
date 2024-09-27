import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient"; // Adjust path as needed
import bcrypt from "bcryptjs";

export async function POST(request) {
	// Parse the JSON request body
	const {
		username,
		email,
		password,
		first_name,
		last_name,
		gender,
		profile_photo,
	} = await request.json();

	// Validate required fields
	if (!username || !email || !password) {
		console.error("Validation failed");
		return NextResponse.json(
			{ error: "Username, email, and password are required." },
			{ status: 400 }
		);
	}
	try {
		// Check if the user already exists
		const { data: existingUser, error: checkError } = await supabase
			.from("users")
			.select("id")
			.or(`email.eq.${email},username.eq.${username}`)
			.single();

		if (existingUser) {
			console.error("User already exists");
			return NextResponse.json(
				{ error: "Email or username already exists." },
				{ status: 409 }
			);
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Insert user into Supabase
		const { error: insertError } = await supabase.from("users").insert([
			{
				first_name,
				last_name,
				username,
				email,
				password_hash: hashedPassword,
				gender,
				profile_photo,
			},
		]);

		if (insertError) {
			console.error("Insert error:", insertError.message);
			return NextResponse.json({ error: insertError.message }, { status: 500 });
		}

		return NextResponse.json(
			{
				message: "User created successfully",
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Catch error:", error.message);
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}
