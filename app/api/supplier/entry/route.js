import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient"; // Import Supabase client

export async function POST(request) {
	try {
		const {
			shopid,
			productid,
			supplierid,
			productType,
			purchasedate,
			purchaseunitprice,
			purchasequantity,
			supplyVariations, // Array of variations
		} = await request.json();
		console.log(
			shopid,
			productid,
			supplierid,
			productType,
			purchasedate,
			purchaseunitprice,
			purchasequantity,
			supplyVariations
		);

		// Validate required fields
		if (!shopid || !productid || !supplierid || !productType) {
			return NextResponse.json(
				{ error: "Missing required fields: shopid, productname, or sku" },
				{ status: 400 }
			);
		}

		// Insert the product type the database
		const { data, error } = await supabase
			.from("product_types")
			.insert({
				productid: productid,
				shopid: shopid,
				producttype: productType,
			})
			.select();

		if (error) {
			console.log(error);
			return NextResponse.json(
				{ error: "Failed to create product type" },
				{ status: 500 }
			);
		}

		const producttypeid = data[0].producttypeid;

		var supplyvariationid = [];
		if (supplyVariations.length > 0) {
			for (let i = 0; i < supplyVariations.length; i++) {
				let variation = {
					...supplyVariations[i],
					purchaseprice:
						supplyVariations[i].purchaseprice == ""
							? 0.0
							: parseFloat(supplyVariations[i].purchaseprice), // Convert price to a number
					purchasequantity:
						supplyVariations[i].purchasequantity == ""
							? 0
							: parseFloat(supplyVariations[i].purchasequantity), // Convert sale_price to a number
					productid: productid, // Add the product ID
					shopid: shopid,
					supplierid: supplierid,
					attributes: JSON.stringify(supplyVariations[i].attributes), // Ensure attributes are JSON serialized
				};
				console.log(variation);

				const { data, error } = await supabase
					.from("supply_variants")
					.insert(variation)
					.select();
				if (error) {
					console.log(error);
					return NextResponse.json(
						{ error: "Failed to create product type" },
						{ status: 500 }
					);
				}
				console.log(data[0]);
				supplyvariationid.push(data[0].supplyvariationid);
			}
		}

		const { data: entries, error: err } = await supabase
			.from("product_supplier_entries")
			.insert({
				productid,
				supplierid,
				shopid,
				producttypeid,
				purchasedate,
				purchaseunitprice,
				purchasequantity,
				supplyvariationid,
			})
			.select();
		if (err) {
			console.log(err);
			return NextResponse.json(
				{ error: "Failed to create product type" },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ supplyvariationid: supplyvariationid },
			{ status: 201 },
			{ data: entries }
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
		.from("product_supplier_entries")
		.select("*")
		.eq("shopid", shopId);

		

	if (data.length > 0) {
		for (let i = 0; i < data.length; i++) {
			let supplyVariationId = data[i].supplyvariationid;
			let productTypeID = data[i].producttypeid;
			const { data: type, error: e } = await supabase
				.from("product_types")
				.select("*")
				.eq("producttypeid", productTypeID);
				if (e) {
					console.log(e);
				}
				console.log(type)
				data[i].productType = type[0].producttype;

			// Initialize supplyVariations as an empty array if it doesn't exist
			if (!data[i].supplyVariations) {
				data[i].supplyVariations = [];
			}

			if (supplyVariationId.length > 0) {
				for (let j = 0; j < supplyVariationId.length; j++) {
					const { data: supplyVariations, error: err } = await supabase
						.from("supply_variants")
						.select("*")
						.eq("supplyvariationid", supplyVariationId[j]);
					if (err) {
						console.log(err);
					}
					data[i].supplyVariations.push(supplyVariations);
				}
			}
		}
	}

	if (error) {
		return NextResponse.json(
			{ error: "Failed to fetch products", details: error.message },
			{ status: 500 }
		);
	}

	return NextResponse.json({ entries: data }, { status: 200 });
}
