"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Utility to generate combinations of attributes
const generateCombinations = (attributes) => {
	const keys = Object.keys(attributes);
	const combinations = [];

	const helper = (current, index) => {
		if (index === keys.length) {
			combinations.push(current);
			return;
		}

		const key = keys[index];
		for (let value of attributes[key]) {
			helper({ ...current, [key]: value }, index + 1);
		}
	};

	helper({}, 0);
	return combinations;
};

const StockEntry = ({ shop }) => {
	const [productType, setProductType] = useState("single");
	const [products, setProducts] = useState([]);
	const [product, setProduct] = useState();
	const [purchaseDate, setPurchaseDate] = useState(Date.now());
	const [suppliers, setSuppliers] = useState([]);
	const [variations, setVariations] = useState([]);
	const [attributes, setAttributes] = useState([]); // Sample attributes, you can fetch this data dynamically
	const [purchaseUnitPrice, setPurchaseUnitPrice] = useState(0);
	const [purchaseQuantity, setPurchaseQuantity] = useState(0);
	const [supplierId, setSupplierId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
	

	useEffect(() => {
		const fetchSuppliers = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/supplier", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"shop-id": shop.id, // Shop ID for fetching suppliers
					},
				});

				const result = await response.json();

				if (response.ok) {
					setSuppliers(result.suppliers);
				} else {
					setError(result.error || "Failed to fetch suppliers.");
				}
			} catch (err) {
				setError("Something went wrong. Please try again.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		const fetchProducts = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch("/api/products", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"shop-id": shop.id,
					},
				});

				const result = await response.json();

				if (response.ok) {
					setProducts(result.products);
				} else {
					setError(result.error || "Failed to fetch products.");
				}
			} catch (err) {
				setError("Something went wrong. Please try again.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		if (shop) {
			fetchSuppliers();
			fetchProducts();
		}
	}, [shop]);

	// Handle adding a new attribute
	const addAttribute = () => {
		setAttributes([...attributes, { id: Date.now(), name: "", options: [] }]);
	};

	// Handle deleting an attribute
	const deleteAttribute = (index) => {
		const newAttributes = attributes.filter((_, i) => i !== index);
		setAttributes(newAttributes);
	};

	// Handle adding a new option to an attribute
	const addAttributeOption = (attrIndex) => {
		const newAttributes = [...attributes];
		newAttributes[attrIndex].options.push("");
		setAttributes(newAttributes);
	};

	// Handle deleting an option from an attribute
	const deleteAttributeOption = (attrIndex, optIndex) => {
		const newAttributes = [...attributes];
		newAttributes[attrIndex].options.splice(optIndex, 1);
		setAttributes(newAttributes);
	};

	// Handle attribute change
	const handleAttributeChange = (attrIndex, field, value) => {
		const newAttributes = [...attributes];
		if (field === "name") {
			newAttributes[attrIndex].name = value;
		}
		setAttributes(newAttributes);
	};

	// Handle option change for an attribute
	const handleOptionChange = (attrIndex, optIndex, value) => {
		const newAttributes = [...attributes];
		newAttributes[attrIndex].options[optIndex] = value;
		setAttributes(newAttributes);
	};

	// Handle adding a manual variation
	const addManualVariation = () => {
		setVariations([
			...variations,
			{
				sku: "",
				purchaseprice: "",
				purchasequantity: "",
				attributes: attributes.map((attr) => ({
					name: attr.name,
					option: "",
				})),
			},
		]);
	};

	// Handle manual variation attribute selection
	const handleVariationAttributeChange = (variationIndex, attrIndex, value) => {
		const newVariations = [...variations];
		newVariations[variationIndex].attributes[attrIndex].option = value;
		setVariations(newVariations);
	};

	// Handle variation change
	const handleVariationChange = (index, field, value) => {
		const newVariations = [...variations];
		newVariations[index][field] = value;
		setVariations(newVariations);
	};

	const handleVariationDelete = (index) => {
		const newVariations = [...variations];
		newVariations.splice(index, 1);
		setVariations(newVariations);
	};

	// Handle auto-generation of variations
	const autoGenerateVariations = () => {
		const attributeCombinations = getCombinations(attributes);
		const newVariations = attributeCombinations.map((combination) => ({
			sku: "",
			purchaseprice: "",
			purchasequantity: "",
			attributes: combination,
		}));
		setVariations(newVariations);
	};

	const handleSubmit = async () => {
		console.log(variations);
		console.log(product);
		console.log(supplierId);
		console.log(purchaseDate);
		console.log(purchaseQuantity);
    const allData = {
			shopid: shop.id,
			productType,
			productid: product,
			supplierid: supplierId,
			purchasedate: purchaseDate,
			purchasequantity: purchaseQuantity,
			purchaseunitprice: purchaseUnitPrice,
			supplyVariations: variations,
		};

    setLoading(true);
		setError(null);
		setSuccess(null);

    try {
			const response = await fetch("/api/supplier/entry", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(allData),
			});

			const result = await response.json();

			if (response.ok) {
				setSuccess("Stock entry added successfully!");
        
			} else {
				setError(result.error || "Failed to add stock entry.");
			}
		} catch (err) {
			setError("An unexpected error occurred.");
		} finally {
			setLoading(false);
		}


	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h1>Stock Entry</h1>

			{/* Product Type */}
			<div>
				<label>Product Type</label>
				<select
					value={productType}
					onChange={(e) => setProductType(e.target.value)}>
					<option value="single">Single</option>
					<option value="variable">Variable</option>
				</select>
			</div>

			{/* Product */}
			<div>
				<label>Product</label>
				<select onChange={(e) => setProduct(e.target.value)}>
					<option>Select Product</option>
					{products.map((prod) => (
						<option key={prod.productid} value={prod.productid}>
							{prod.productname}
						</option>
					))}
				</select>
			</div>

			{/* Supplier */}
			<div>
				<label>Supplier</label>
				<select onChange={(e) => setSupplierId(e.target.value)}>
					<option>Select Supplier</option>
					{suppliers.map((supplier) => (
						<option key={supplier.supplierid} value={supplier.supplierid}>
							{supplier.suppliername}
						</option>
					))}
				</select>
			</div>

			{/* Date */}
			<div>
				<label>Date</label>
				<input
					type="date"
					value={formatDate(purchaseDate)}
					onChange={(e) => setPurchaseDate(e.target.value)}
					className="p-2 border border-gray-300 rounded"
				/>
			</div>

			{/* Purchase Unit Price */}
			<div>
				<label>Purchase Unit Price</label>
				<input
					type="number"
					step="0.01"
					value={purchaseUnitPrice}
					onChange={(e) => setPurchaseUnitPrice(e.target.value)}
					className="p-2 border border-gray-300 rounded"
					placeholder="Purchase Unit Price"
				/>
			</div>

			{/* Purchase Quantity */}
			<div>
				<label>Purchase Quantity</label>
				<input
					type="number"
					value={purchaseQuantity}
					onChange={(e) => setPurchaseQuantity(e.target.value)}
					className="p-2 border border-gray-300 rounded mb-2"
				/>
			</div>

			{/* Auto-generate Variations */}
			{productType == "variable" && (
				<>
					<h2 className="text-lg font-semibold mb-2">Attributes</h2>
					{attributes.map((attribute, attrIndex) => (
						<div
							key={attribute.id}
							className="mb-4 p-4 border border-gray-300 rounded">
							<input
								type="text"
								value={attribute.name}
								onChange={(e) =>
									handleAttributeChange(attrIndex, "name", e.target.value)
								}
								placeholder="Attribute Name"
								className="p-2 border border-gray-300 rounded w-full mb-2"
							/>
							<button
								type="button"
								onClick={() => deleteAttribute(attrIndex)}
								className="bg-red-500 text-white px-4 py-2 rounded mb-2">
								Delete Attribute
							</button>
							<h3 className="font-semibold mb-2">Options</h3>
							<button
								type="button"
								onClick={() => addAttributeOption(attrIndex)}
								className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
								Add Option
							</button>
							{attribute.options.map((option, optIndex) => (
								<div key={optIndex} className="mb-2">
									<input
										type="text"
										value={option}
										onChange={(e) =>
											handleOptionChange(attrIndex, optIndex, e.target.value)
										}
										placeholder="Option"
										className="p-2 border border-gray-300 rounded w-full mb-2"
									/>
									<button
										type="button"
										onClick={() => deleteAttributeOption(attrIndex, optIndex)}
										className="bg-red-500 text-white px-4 py-2 rounded">
										Delete Option
									</button>
								</div>
							))}
						</div>
					))}
					<button
						type="button"
						onClick={addAttribute}
						className="text-blue-500 mb-4">
						Add Attribute
					</button>

					<h2 className="text-lg font-semibold mb-2">Variations</h2>
					{variations.map((variation, index) => (
						<div key={index} className="mb-4">
							<input
								type="text"
								value={variation.sku}
								onChange={(e) =>
									handleVariationChange(index, "sku", e.target.value)
								}
								placeholder="SKU"
								className="p-2 border border-gray-300 rounded w-full mb-2"
							/>
							<input
								type="number"
								value={variation.purchaseprice}
								onChange={(e) =>
									handleVariationChange(index, "purchaseprice", e.target.value)
								}
								placeholder="Price"
								className="p-2 border border-gray-300 rounded w-full mb-2"
							/>
							<input
								type="number"
								value={variation.purchasequantity}
								onChange={(e) =>
									handleVariationChange(
										index,
										"purchasequantity",
										e.target.value
									)
								}
								placeholder="Quantity"
								className="p-2 border border-gray-300 rounded w-full mb-2"
							/>
							{variation.attributes.map((attr, attrIndex) => (
								<select
									key={attr.name}
									value={attr.option}
									onChange={(e) =>
										handleVariationAttributeChange(
											index,
											attrIndex,
											e.target.value
										)
									}
									className="p-2 border border-gray-300 rounded w-full mb-2">
									<option value="">Select {attr.name}</option>
									{attributes
										.find((a) => a.name === attr.name)
										?.options.map((option, optIndex) => (
											<option key={optIndex} value={option}>
												{option}
											</option>
										))}
								</select>
							))}
							<button
								type="button"
								onClick={() => handleVariationDelete(index)}
								className="text-red-500">
								Delete Variation
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={addManualVariation}
						className="text-blue-500 mb-4">
						Add Manual Variation
					</button>
					<button
						type="button"
						onClick={autoGenerateVariations}
						className="text-blue-500 mb-4">
						Auto Generate Variations
					</button>
				</>
			)}

			{/* <button onClick={handleSubmit}>Submit Stock Entry</button> */}
			{/* Submit Button */}
			<button type="submit" disabled={loading} onClick={handleSubmit}>
				{loading ? "Submitting..." : "Submit Stock Entry"}
			</button>

			{/* Display success or error message */}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{success && <p style={{ color: "green" }}>{success}</p>}
		</div>
	);
};

export default StockEntry;

const getCombinations = (attributes) => {
	const combinations = [[]];
	for (const attribute of attributes) {
		const newCombinations = [];
		for (const option of attribute.options) {
			for (const combination of combinations) {
				newCombinations.push([
					...combination,
					{ name: attribute.name, option },
				]);
			}
		}
		combinations.splice(0, combinations.length, ...newCombinations);
	}
	return combinations;
};

// Helper function to format the date
const formatDate = (timestamp) => {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};
