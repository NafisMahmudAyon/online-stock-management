import React, { useState, useEffect } from "react";

const ProductEdit = ({ shopid, product, setOpen }) => {
	const [isVariable, setIsVariable] = useState(false); // Track if the product is variable
	const [unitPrice, setUnitPrice] = useState(product.unitprice || ""); // For both single and variable products
	const [salePrice, setSalePrice] = useState(product.saleprice || "");
	const [dateOnSaleFrom, setDateOnSaleFrom] = useState(
		product.dateonsalefrom || ""
	);
	const [dateOnSaleTo, setDateOnSaleTo] = useState(product.dateonsaleto || "");
	const [variations, setVariations] = useState([]);
	const [variationsPrice, setVariationsPrice] = useState(
		product.variationsprice || []
	);

	useEffect(() => {
		// Check if the product has variations to determine if it's a variable product
		if (product.prodVariations && product.prodVariations.length > 0) {
			setIsVariable(true);
			setVariations(product.prodVariations);
		} else {
			setIsVariable(false);
		}
	}, [product]);

	const handleVariationPriceChange = (index, value) => {
		const updatedVariations = [...variations];
		updatedVariations[index].price = value;
		setVariations(updatedVariations);
	};

	const handleVariationsPriceChange = (index, value) => {
		const updatedVariationsPrice = [...variationsPrice];
		updatedVariationsPrice[index] = value;
		setVariationsPrice(updatedVariationsPrice);
	};

	const handleSave = () => {
		// Logic to save updated product details (unit price, sale price, variations, etc.)
		console.log("Save product changes:", {
			unitPrice,
			salePrice,
			dateOnSaleFrom,
			dateOnSaleTo,
			variationsPrice,
			variations,
		});
		// Close modal after save
		setOpen(false);
	};

	return (
		<div className="fixed inset-0 bg-itemBackground/15 backdrop-blur-sm grid place-items-center">
			<div className="min-w-[85vw] max-h-[85vh] overflow-scroll bg-red-900 relative p-4">
				<button
					className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 text-white bg-red-500 rounded-full"
					onClick={() => setOpen(false)}>
					&times;
				</button>
				<h2 className="text-white text-2xl mb-4">{product.productname}</h2>
				<p className="text-white mb-2">SKU: {product.sku}</p>

				{/* Common Fields for both Single and Variable Products */}
				<div className="mb-4">
					<label className="text-white">Unit Price:</label>
					<input
						type="number"
						value={unitPrice}
						onChange={(e) => setUnitPrice(e.target.value)}
						className="ml-2 p-2 rounded bg-gray-700 text-white"
					/>
				</div>
				<div className="mb-4">
					<label className="text-white">Sale Price:</label>
					<input
						type="number"
						value={salePrice}
						onChange={(e) => setSalePrice(e.target.value)}
						className="ml-2 p-2 rounded bg-gray-700 text-white"
					/>
				</div>
				<div className="mb-4">
					<label className="text-white">Sale Start Date:</label>
					<input
						type="date"
						value={dateOnSaleFrom}
						onChange={(e) => setDateOnSaleFrom(e.target.value)}
						className="ml-2 p-2 rounded bg-gray-700 text-white"
					/>
				</div>
				<div className="mb-4">
					<label className="text-white">Sale End Date:</label>
					<input
						type="date"
						value={dateOnSaleTo}
						onChange={(e) => setDateOnSaleTo(e.target.value)}
						className="ml-2 p-2 rounded bg-gray-700 text-white"
					/>
				</div>

				{isVariable && (
					<div>
						<h3 className="text-white text-lg mb-4">Product Variations</h3>
						{variations.map((variation, index) => (
							<div
								key={variation.supplyvariationid}
								className="mb-4 p-4 bg-gray-800 rounded">
								<p className="text-white">Variation SKU: {variation.sku}</p>
								<p className="text-white">
									Attributes:{" "}
									{JSON.parse(variation.attributes)
										.map((attr) => `${attr.name}: ${attr.option}`)
										.join(", ")}
								</p>
								<div className="mt-2">
									<label className="text-white">Price:</label>
									<input
										type="number"
										value={variation.price || ""}
										onChange={(e) =>
											handleVariationPriceChange(index, e.target.value)
										}
										className="ml-2 p-2 rounded bg-gray-700 text-white"
									/>
								</div>
								<div className="mt-2">
									<label className="text-white">Sale Price:</label>
									<input
										type="number"
										value={variation.sale_price || ""}
										onChange={(e) => {
											const updatedVariations = [...variations];
											updatedVariations[index].sale_price = e.target.value;
											setVariations(updatedVariations);
										}}
										className="ml-2 p-2 rounded bg-gray-700 text-white"
									/>
								</div>
								{/* Variation Price List (variationsprice for variable products) */}
								<div className="mt-2">
									<label className="text-white">
										Variation Product IDs (for prices):
									</label>
									<input
										type="number"
										value={variationsPrice[index] || ""}
										onChange={(e) =>
											handleVariationsPriceChange(index, e.target.value)
										}
										className="ml-2 p-2 rounded bg-gray-700 text-white"
									/>
								</div>
							</div>
						))}
					</div>
				)}

				<button
					onClick={handleSave}
					className="mt-4 p-3 bg-green-500 text-white rounded">
					Save Changes
				</button>
			</div>
		</div>
	);
};

export default ProductEdit;
