// /api/auth/login.js

import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient";
import bcrypt from "bcryptjs";

export async function POST(request) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return NextResponse.json(
			{ error: "Email and password are required." },
			{ status: 400 }
		);
	}

	try {
		// Fetch user from Supabase
		const { data: user, error: fetchError } = await supabase
			.from("users")
			.select("id, username, password_hash")
			.eq("email", email)
			.single();

		if (fetchError || !user) {
			return NextResponse.json(
				{ error: "Invalid email or password." },
				{ status: 401 }
			);
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password_hash);

		if (!isMatch) {
			return NextResponse.json(
				{ error: "Invalid email or password." },
				{ status: 401 }
			);
		}

		// Generate JWT
		const userData = {
			userDetails: { id: user.id, username: user.username, email: email },
		};

		return NextResponse.json({ userData }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}
