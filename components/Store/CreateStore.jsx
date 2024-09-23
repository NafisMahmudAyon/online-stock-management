"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Assuming AuthContext is correctly set up
import Input from "../Form/Input";
import Breadcrumbs from "../Breadcrumbs";

const CreateStore = ({ onShopCreated }) => {
	// Add onShopCreated prop
	const { user } = useAuth(); // Get the logged-in user
	const router = useRouter();
	const [shopName, setShopName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		if (!shopName.trim()) {
			setError("Shop name is required");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/shops", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: shopName, userId: user.userDetails.id }), // Pass user.id in the request body
			});

			const data = await response.json();

			if (response.ok) {
				setSuccess("Shop created successfully!");
				setShopName(""); // Clear the form
				onShopCreated(); // Notify parent about the new shop
				router.push(`/dashboard`); // Redirect to shop dashboard
			} else {
				setError(data.error || "Failed to create shop.");
			}
		} catch (err) {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full">
			<Breadcrumbs items={["Create Store"]} />
			{error && <p className="text-red-500 mb-4">{error}</p>}
			{success && <p className="text-green-500 mb-4">{success}</p>}
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					id="shopName"
					label="Shop Name"
					value={shopName}
					placeholder="Enter Shop Name"
					onChange={(e) => setShopName(e.target.value)}
					required={true}
					inputStyle="border-blue-500"
				/>
				<div>
					<button
						type="submit"
						className="flex bg-buttonBackground text-mainColor font-semibold py-2 px-4 rounded-md"
						disabled={loading}>
						{loading ? "Creating Shop..." : "Create Shop"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateStore;
