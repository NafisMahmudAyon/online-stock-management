"use client";
import React, { useEffect, useState } from "react";
import ProductEdit from "./ProductEdit";

const AllProducts = ({ shop }) => {
	const [products, setProducts] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [activeProduct, setActiveProduct] = useState(null); // Change from activeId to activeProduct
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	useEffect(() => {
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
				console.log(result);

				if (response.ok) {
					setProducts(result.products);
				} else {
					setError(result.error || "Failed to fetch Products.");
				}
			} catch (err) {
				setError("Something went wrong. Please try again.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		if (shop) {
			fetchProducts();
		}
	}, [shop]);

	const handleEdit = (productId) => {
		const productToEdit = products.find(
			(product) => product.productid === productId
		);
		setActiveProduct(productToEdit);
		setIsOpen(true);
	};

	const handleDelete = async (productId) => {
		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"shop-id": shop.id,
				},
			});

			if (response.ok) {
				setProducts(
					products.filter((product) => product.productid !== productId)
				);
				setSuccess("Product deleted successfully.");
			} else {
				const result = await response.json();
				setError(result.error || "Failed to delete product.");
			}
		} catch (err) {
			setError("Something went wrong. Please try again.");
			console.error(err);
		}
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div>
			<h2>All Products in {shop.name}</h2>
			{success && <p>{success}</p>}
			<table className="min-w-full border border-gray-300">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b">Product ID</th>
						<th className="py-2 px-4 border-b">Name</th>
						<th className="py-2 px-4 border-b">Sku</th>
						<th className="py-2 px-4 border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product.productid}>
							<td className="py-2 px-4 border-b">{product.productid}</td>
							<td className="py-2 px-4 border-b">{product.productname}</td>
							<td className="py-2 px-4 border-b">{product.sku}</td>
							<td className="py-2 px-4 border-b">
								<button
									onClick={() => handleEdit(product.productid)}
									className="mr-2 p-2 bg-blue-500 text-white rounded">
									Edit
								</button>
								<button
									onClick={() => handleDelete(product.productid)}
									className="p-2 bg-red-500 text-white rounded">
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{isOpen && activeProduct && (
				<ProductEdit
					shopid={shop.id}
					product={activeProduct}
					setOpen={setIsOpen}
				/>
			)}
		</div>
	);
};

export default AllProducts;
