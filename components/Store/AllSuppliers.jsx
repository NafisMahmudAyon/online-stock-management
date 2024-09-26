'use client'
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const AllSuppliers = ({ shop }) => {
  const { user } = useAuth();
	const [suppliers, setSuppliers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Fetch suppliers when the component mounts or the shop changes
		const fetchSuppliers = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/supplier", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"user-email": user.userDetails.email, // Replace with actual user email
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

		if (shop) {
			fetchSuppliers();
		}
	}, [shop]);

	if (loading) {
		return <p>Loading suppliers...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	if (!suppliers.length) {
		return <p>No suppliers found for {shop.name}.</p>;
	}

	return (
		<div>
			<h2>All Suppliers for {shop.name}</h2>
			<ul className="space-y-4">
				{suppliers.map((supplier) => (
					<li key={supplier.id} className="border p-4 rounded-md">
						<h3 className="text-lg font-medium">{supplier.suppliername}</h3>
						<p>
							<strong>Contact Person:</strong> {supplier.contactperson || "N/A"}
						</p>
						<p>
							<strong>Email:</strong> {supplier.email}
						</p>
						<p>
							<strong>Phone Number:</strong> {supplier.phonenumber || "N/A"}
						</p>
						<p>
							<strong>Address:</strong> {supplier.address || "N/A"}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AllSuppliers;
