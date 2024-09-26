"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateSupplier = ({ shop, onSupplierCreated }) => {
	const [supplierName, setSupplierName] = useState("");
	const [contactPerson, setContactPerson] = useState("");
	const [address, setAddress] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	console.log(error)

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null); // Clear any previous errors

		// Basic validation
		if (!supplierName || !email) {
			setError("Supplier name and email are required.");
			return;
		}

		setIsSubmitting(true);

		try {
			// Send request to create supplier via the API
			const response = await fetch("/api/supplier", {
				method: "POST",
				body: JSON.stringify({
					shopId: shop.id,
					supplierName,
					contactPerson,
					address,
					phoneNumber,
					email,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const result = await response.json();

			if (response.ok) {
				// Supplier created successfully
				console.log(result.message);

				// Reset form fields
				setSupplierName("");
				setContactPerson("");
				setAddress("");
				setPhoneNumber("");
				setEmail("");

				// Trigger the parent component's callback to switch to "allSuppliers"
				if (onSupplierCreated) {
					onSupplierCreated();
				}

				// Optionally, you can redirect the user to the supplier list page if needed
				// router.push(`/dashboard/${shop.slug}/suppliers`);
			} else {
				setError(result.error || "Failed to create supplier.");
			}
		} catch (err) {
			console.log(err)
			setError("Something went wrong. Please try again.");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<h2>Create Supplier for {shop.name}</h2>

			{error && <p className="error">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="supplierName" className="block font-medium">
						Supplier Name
					</label>
					<input
						type="text"
						id="supplierName"
						value={supplierName}
						onChange={(e) => setSupplierName(e.target.value)}
						className="border p-2 w-full"
						required
					/>
				</div>

				<div>
					<label htmlFor="contactPerson" className="block font-medium">
						Contact Person
					</label>
					<input
						type="text"
						id="contactPerson"
						value={contactPerson}
						onChange={(e) => setContactPerson(e.target.value)}
						className="border p-2 w-full"
					/>
				</div>

				<div>
					<label htmlFor="address" className="block font-medium">
						Address
					</label>
					<input
						type="text"
						id="address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						className="border p-2 w-full"
					/>
				</div>

				<div>
					<label htmlFor="phoneNumber" className="block font-medium">
						Phone Number
					</label>
					<input
						type="text"
						id="phoneNumber"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						className="border p-2 w-full"
					/>
				</div>

				<div>
					<label htmlFor="email" className="block font-medium">
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="border p-2 w-full"
						required
					/>
				</div>

				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
					disabled={isSubmitting}>
					{isSubmitting ? "Creating Supplier..." : "Create Supplier"}
				</button>
			</form>
		</div>
	);
};

export default CreateSupplier;
