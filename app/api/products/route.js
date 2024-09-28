import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient"; // Import Supabase client

export async function POST(request) {
	try {
		// Parse the JSON body from the request
		const {
			shopid,
			productname,
			description,
			shortdescription,
			sku,
			categories,
		} = await request.json();

		// Validate required fields
		if (!shopid || !productname || !sku) {
			return NextResponse.json(
				{ error: "Missing required fields: shopid, productname, or sku" },
				{ status: 400 }
			);
		}

		// Insert the product into the database
		const { data, error } = await supabase
			.from("products")
			.insert({
				shopid,
				productname,
				description,
				shortdescription,
				sku,
				categories,
				created_at: new Date(),
				updated_at: new Date(),
			})
			.select(); // Select returns the newly created product

		// Handle errors in the insert operation
		if (error) {
			return NextResponse.json(
				{ error: "Failed to create product", details: error.message },
				{ status: 500 }
			);
		}

		// Return success with the created product
		return NextResponse.json(
			{ product: data[0] },
			{ status: 201 },
			{ data: data }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	const shopId = request.headers.get("shop-id");

	// Validate shopid
	if (!shopId) {
		return NextResponse.json({ error: "Missing shop ID" }, { status: 400 });
	}

	// Fetch products by shop ID
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("shopid", shopId);

	if (error) {
		return NextResponse.json(
			{ error: "Failed to fetch products", details: error.message },
			{ status: 500 }
		);
	}
	if (data) {
		const products = data;
		for (let i = 0; i < products.length; i++) {
			const prodID = products[i].productid;
			// const { data: prodType, error: prodTypeError } = await supabase
			// 	.from("product_types")
			// 	.select("producttype")
			// 	.eq("shopid", shopId)
			// 	.eq("productid", prodID);
			// console.log(prodTypeError);
			// console.log(prodType);
			const { data: prodVariations, error: prodError } = await supabase
				.from("supply_variants")
				.select("*")
				.eq("shopid", shopId)
				.eq("productid", prodID);

			if (prodError) {
				console.error(
					`Error fetching variations for product ${prodID}:`,
					prodError
				);
				return NextResponse.json(
					{
						error: `Error fetching variations for product ${prodID}`,
						details: prodError.message,
					},
					{ status: 500 }
				);
				// You could either skip this product or return an error response here.
			} else {

				products[i] = { ...products[i], prodVariations };
			}
		}
	}
	

	return NextResponse.json({ products: data }, { status: 200 });
}
