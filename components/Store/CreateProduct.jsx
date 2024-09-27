import React, { useState, useEffect } from "react";
import Select from "react-select";

const CreateProduct = ({ shop }) => {
	const [formData, setFormData] = useState({
		productname: "",
		description: "",
		shortdescription: "",
		sku: "",
		categories: [], // Array to hold multiple category IDs
	});

	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	// Fetch categories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/categories");
				const data = await response.json();
				if (response.ok) {
					// Map categories to react-select options format
					const categoryOptions = data.categories.map((category) => ({
						value: category.id,
						label: category.name,
					}));
					setCategories(categoryOptions);
				} else {
					setError("Failed to load categories");
				}
			} catch (error) {
				setError("An error occurred while fetching categories");
			}
		};
		fetchCategories();
	}, []);

	// Handle form input changes
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle react-select change for categories (multiple selection)
	const handleCategoryChange = (selectedOptions) => {
		const selectedIds = selectedOptions
			? selectedOptions.map((option) => option.value)
			: [];
		setFormData({ ...formData, categories: selectedIds });
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response = await fetch("/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					shopid: shop.id,
					productname: formData.productname,
					description: formData.description,
					shortdescription: formData.shortdescription,
					sku: formData.sku,
					categories: formData.category_ids, // Send array of category IDs
				}),
			});

			const result = await response.json();

			if (response.ok) {
				setSuccess("Product created successfully!");
				setFormData({
					productname: "",
					description: "",
					shortdescription: "",
					sku: "",
					categories: [],
				});
			} else {
				setError(result.error || "Failed to create product.");
			}
		} catch (err) {
			setError("An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2>Create Product for {shop.name}</h2>
			<form onSubmit={handleSubmit}>
				{/* Product Name */}
				<div>
					<label htmlFor="productname">Product Name</label>
					<input
						type="text"
						id="productname"
						name="productname"
						value={formData.productname}
						onChange={handleInputChange}
						required
					/>
				</div>

				{/* Description */}
				<div>
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleInputChange}
					/>
				</div>

				{/* Short Description */}
				<div>
					<label htmlFor="shortdescription">Short Description</label>
					<textarea
						id="shortdescription"
						name="shortdescription"
						value={formData.shortdescription}
						onChange={handleInputChange}
					/>
				</div>

				{/* SKU */}
				<div>
					<label htmlFor="sku">SKU</label>
					<input
						type="text"
						id="sku"
						name="sku"
						value={formData.sku}
						onChange={handleInputChange}
						required
					/>
				</div>

				{/* Categories Dropdown with react-select (multiple selection) */}
				<div>
					<label htmlFor="category_ids">Categories</label>
					<Select
						options={categories}
						onChange={handleCategoryChange}
						value={categories.filter((option) =>
							formData.categories.includes(option.value)
						)}
						isMulti
						placeholder="Select categories"
					/>
				</div>

				{/* Submit Button */}
				<button type="submit" disabled={loading}>
					{loading ? "Creating..." : "Create Product"}
				</button>

				{/* Display success or error message */}
				{error && <p style={{ color: "red" }}>{error}</p>}
				{success && <p style={{ color: "green" }}>{success}</p>}
			</form>
		</div>
	);
};

export default CreateProduct;
