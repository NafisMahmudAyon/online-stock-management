import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient"; // Import Supabase client

export async function POST(request) {
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
	console.log(data[0]);
	const producttypeid = data[0].producttypeid;
	console.log(producttypeid);
	// return NextResponse.json({ productType: data[0] }, { status: 201 }, { data: data });

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
      producttypeid,
      purchasedate,
      purchaseunitprice,
      purchasequantity,
      supplyvariationid
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

	// try {
	// 	const {
	// 		productid,
	// 		supplierid,
	// 		producttypeid,
	// 		purchasedate,
	// 		purchaseunitprice,
	// 		purchasequantity,
	// 		supplyVariations, // Array of variations
	// 	} = await request.json();

	// 	// Validate required fields
	// 	if (!productid || !supplierid || !producttypeid || !purchasedate) {
	// 		return NextResponse.json(
	// 			{ error: "Missing required fields" },
	// 			{ status: 400 }
	// 		);
	// 	}

	// 	// Insert product supplier entry
	// 	const { data: entryData, error: entryError } = await supabase
	// 		.from("product_supplier_entries")
	// 		.insert({
	// 			productid,
	// 			supplierid,
	// 			producttypeid,
	// 			purchasedate,
	// 			purchaseunitprice,
	// 			purchasequantity,
	// 			created_at: new Date(),
	// 			updated_at: new Date(),
	// 		})
	// 		.select(); // Select the created entry

	// 	if (entryError) {
	// 		return NextResponse.json(
	// 			{
	// 				error: "Failed to create product supplier entry",
	// 				details: entryError.message,
	// 			},
	// 			{ status: 500 }
	// 		);
	// 	}

	// 	// If product is variable, insert supply variants
	// 	if (supplyVariations && supplyVariations.length > 0) {
	// 		const supplyVariantInserts = supplyVariations.map((variant) => ({
	// 			shopid: entryData[0].shopid,
	// 			productid,
	// 			purchaseprice: variant.price,
	// 			purchasequantity: variant.quantity,
	// 			attributes: variant.attributes, // Ensure this matches your structure
	// 			created_at: new Date(),
	// 			updated_at: new Date(),
	// 		}));

	// 		const { data: variantData, error: variantError } = await supabase
	// 			.from("supply_variants")
	// 			.insert(supplyVariantInserts)
	// 			.select();

	// 		if (variantError) {
	// 			return NextResponse.json(
	// 				{
	// 					error: "Failed to create supply variants",
	// 					details: variantError.message,
	// 				},
	// 				{ status: 500 }
	// 			);
	// 		}

	// 		// Update the product_supplier_entries record with supplyvariationid
	// 		const variantIds = variantData.map(
	// 			(variant) => variant.supplyvariationid
	// 		);
	// 		await supabase
	// 			.from("product_supplier_entries")
	// 			.update({ supplyvariationid: variantIds })
	// 			.eq("entryid", entryData[0].entryid);
	// 	}

	// 	return NextResponse.json(
	// 		{ message: "Product supplier entry created successfully" },
	// 		{ status: 201 }
	// 	);
	// } catch (error) {
	// 	return NextResponse.json(
	// 		{ error: "Internal Server Error", details: error.message },
	// 		{ status: 500 }
	// 	);
	// }
}
