"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Profile from "@/components/User/Profile";
import Menu from "@/components/Menu/Menu";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import CreateStore from "@/components/Store/CreateStore";
import StoreList from "@/components/Store/StoreList";
import Store from "@/components/Store/Store";

export default function Dashboard() {
	const { user, logout } = useAuth();
	const router = useRouter();
	const [activeMenu, setActiveMenu] = useState("Dashboard");
	const [selectedShop, setSelectedShop] = useState(null);
	const [storeSubMenu, setStoreSubMenu] = useState(null);
	const [shops, setShops] = useState([]); // State for shop list
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	console.log(activeMenu)

	// Fetch shops owned or managed by the user
	const fetchShops = async () => {
		try {
			const response = await fetch("/api/shops", {
				headers: {
					"user-id": user.userDetails.id,
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

	useEffect(() => {
		if (user) {
			fetchShops();
		}
	}, [user]);

	// Refresh shop list after creating a shop
	const handleShopCreated = () => {
		setLoading(true);
		fetchShops();
	};

	// Render content based on active menu and selected shop
	const renderContent = () => {
		if (activeMenu.includes("Store") && selectedShop) {
			return <Store shop={selectedShop} subMenu={storeSubMenu} />;
		}

		switch (activeMenu) {
			case "Create Shop":
				return <CreateStore onShopCreated={handleShopCreated} />;
			case "Dashboard":
				return <DashboardContent />;
			case "Menu 1":
				return <p>Content for Menu 1</p>;
			case "Menu 2":
				return <p>Content for Menu 2</p>;
			// case activeMenu.includes("Store"):
			// 	return <Store shop={selectedShop} subMenu={storeSubMenu} />;
			default:
				return <DashboardContent />;
		}
	};

	console.log(activeMenu.includes("Store"), "dsdadasdasdsdsfsd", selectedShop)

	return (
		<div className="flex gap-8 text-mainColor justify-start px-6 ">
			<aside className="fixed top-0 left-0 min-w-[340px] max-w-[20%] px-2 py-10 flex flex-col items-start h-[100vh] overflow-y-scroll ">
				<Profile />
				<Menu
					activeMenu={activeMenu}
					setActiveMenu={(menu) => {
						setActiveMenu(menu);
						// Reset selected shop and submenu when navigating to a non-shop menu
						if (!menu.includes("Store")) {
							setSelectedShop(null);
							setStoreSubMenu(null);
						}
					}}
					setSelectedShop={setSelectedShop}
					setStoreSubMenu={setStoreSubMenu}
				/>
				<button onClick={logout} className="">
					Logout
				</button>
			</aside>
			<div className="min-w-[340px] max-w-[20%]"></div>
			<main className="flex-1 mt-14 w-full ">
				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<>
						{/* Conditionally render StoreList if activeMenu is "Store" */}
						{activeMenu === "Store" && (
							<StoreList
								activeMenu={activeMenu}
								setActiveMenu={setActiveMenu}
								setSelectedShop={setSelectedShop}
								setStoreSubMenu={setStoreSubMenu}
							/>
						)}
						{renderContent()}
					</>
				)}
			</main>
		</div>
	);
}
