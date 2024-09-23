import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MenuItem from "../Menu/MenuItem";

const StoreList = ({ setActiveMenu, setSelectedShop }) => {
	const { user } = useAuth(); // Get the logged-in user
	const [shops, setShops] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (user) {
			// Fetch shops owned or managed by the user
			const fetchShops = async () => {
				try {
					const response = await fetch(`/api/shops`, {
						headers: {
							"user-id": user.userDetails.id, // Pass user ID in headers
						},
					});
					const data = await response.json();

					if (response.ok) {
						setShops(data.shops);
					} else {
						setError(data.error || "Failed to fetch shops.");
					}
				} catch (err) {
					setError("Something went wrong. Please try again.");
				} finally {
					setLoading(false);
				}
			};

			fetchShops();
		}
	}, [user]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div>
			<h2>Your Shops</h2>
			{shops.length === 0 ? (
				<p>No shops found.</p>
			) : (
				<ul>
					{shops.map((shop) => (
						<MenuItem
							key={shop.id}
							title={shop.name}
							onClick={() => {
								setSelectedShop(shop); // Set the selected shop
								setActiveMenu("Store"); // Activate Store menu
							}}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

export default StoreList;
