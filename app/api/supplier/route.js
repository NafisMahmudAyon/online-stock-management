import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient"; // Assuming you have a Supabase client utility set up

export async function POST(request) {
	try {
		const { shopId, supplierName, contactPerson, address, phoneNumber, email } =
			await request.json();

		// Basic validation
		if (!shopId || !supplierName || !email) {
			return NextResponse.json(
				{ error: "Shop ID, Supplier Name, and Email are required." },
				{ status: 400 }
			);
		}

		// Validate phone number format (optional)
		if (phoneNumber && !/^\+?\d{7,20}$/.test(phoneNumber)) {
			return NextResponse.json(
				{ error: "Invalid phone number format." },
				{ status: 400 }
			);
		}

		// Check if email is unique (since the email field is marked as unique in the database)
		const { data: existingSupplier, error: findError } = await supabase
			.from("suppliers")
			.select("email")
			.eq("email", email)
			.single();

		if (findError && findError.code !== "PGRST116") {
			// 'PGRST116' = No rows returned
			return NextResponse.json(
				{
					error: "Failed to verify email uniqueness.",
					details: findError.message,
				},
				{ status: 500 }
			);
		}

		if (existingSupplier) {
			return NextResponse.json(
				{ error: "A supplier with this email already exists." },
				{ status: 400 }
			);
		}

		// Insert new supplier into the database
		const { data, error } = await supabase
			.from("suppliers")
			.insert({
				shopid: shopId,
				suppliername: supplierName,
				contactperson: contactPerson,
				address,
				phonenumber: phoneNumber,
				email,
			})
			.select(); // Fetch the inserted supplier data

		if (error) {
			return NextResponse.json(
				{ error: "Failed to create supplier.", details: error.message },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "Supplier created successfully", supplier: data },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	// const userEmail = request.headers.get("user-email"); // Get user email from headers

	// if (!userEmail) {
	// 	return NextResponse.json(
	// 		{ error: "Unauthorized. You must be logged in to view suppliers." },
	// 		{ status: 401 }
	// 	);
	// }

	const shopId = request.headers.get("shop-id"); // Get shop ID from headers

	if (!shopId) {
		return NextResponse.json(
			{ error: "Shop ID is required to fetch suppliers." },
			{ status: 400 }
		);
	}

	try {
		// Fetch suppliers where the shop ID matches
		const { data, error } = await supabase
			.from("suppliers")
			.select("*")
			.eq("shopid", shopId);

		if (error) {
			return NextResponse.json(
				{ error: "Failed to fetch suppliers." },
				{ status: 500 }
			);
		}

		return NextResponse.json({ suppliers: data }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}