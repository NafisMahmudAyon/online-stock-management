import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MenuItem from "../Menu/MenuItem";

const StoreList = ({
	activeMenu,
	setActiveMenu,
	setSelectedShop,
	setStoreSubMenu,
}) => {
	const { user } = useAuth(); // Get the logged-in user
	const [shops, setShops] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeSubMenu, setActiveSubMenu] = useState(null);

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
						<li key={shop.id}>
							<MenuItem
								active={activeMenu === `Store${shop.id}`} // Check if this shop is active by comparing its ID
								title={shop.name}
								onClick={() => {
									setSelectedShop(shop); // Set the selected shop
									setStoreSubMenu(null); // Reset sub-menu
									setActiveMenu(`Store${shop.id}`); // Set the shop's ID as the active menu
									setActiveSubMenu(null); // Reset active sub-menu
								}}
							/>
							{activeMenu === `Store${shop.id}` && ( // Show sub-menu only for the active shop
								<ul
									
									>
									<MenuItem
										active={activeSubMenu === "Add User"}
										title="Add User"
										onClick={() => {
											setStoreSubMenu("addUser");
											setActiveSubMenu("Add User"); // Set the active sub-menu
										}}
									/>
									<MenuItem
										active={activeSubMenu === "Users"}
										title="Users"
										onClick={() => {
											setStoreSubMenu("users");
											setActiveSubMenu("Users"); // Set the active sub-menu
										}}
									/>
									<MenuItem
										active={activeSubMenu === "Create Product"}
										title="Create Product"
										onClick={() => {
											setStoreSubMenu("createProduct");
											setActiveSubMenu("Create Product"); // Set the active sub-menu
										}}
									/>
									<MenuItem
										active={activeSubMenu === "All Products"}
										title="All Products"
										onClick={() => {
											setStoreSubMenu("allProducts");
											setActiveSubMenu("All Products"); // Set the active sub-menu
										}}
									/>
								</ul>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default StoreList;
