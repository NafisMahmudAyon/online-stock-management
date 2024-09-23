"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Profile from "@/components/User/Profile";
import Menu from "@/components/Menu/Menu";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import CreateStore from "@/components/Store/CreateStore";
import Store from "@/components/Store/Store"; // Import the Store component

export default function Dashboard() {
	const { user, logout } = useAuth();
	const router = useRouter();
	const [activeMenu, setActiveMenu] = useState("Dashboard");
	const [selectedShop, setSelectedShop] = useState(null); // Track the selected shop

	if (!user) {
		return <p>Loading...</p>; // Alternatively, redirect to login if necessary
	}

	// Handle what to render based on activeMenu
	const renderContent = () => {
		switch (activeMenu) {
			case "Create Store":
				return <CreateStore />;
			case "Dashboard":
				return <DashboardContent />;
			case "Menu 1":
				return <p>Content for Menu 1</p>;
			case "Menu 2":
				return <p>Content for Menu 2</p>;
			case "Store":
				return <Store shop={selectedShop} />; // Pass the selected shop to the Store component
			default:
				return <DashboardContent />;
		}
	};

	return (
		<div className="flex gap-8 text-mainColor justify-start px-6 ">
			<aside className="min-w-[340px] max-w-[20%] px-2 py-10 flex flex-col items-start h-[100vh] ">
				<Profile />
				<Menu
					activeMenu={activeMenu}
					setActiveMenu={setActiveMenu}
					setSelectedShop={setSelectedShop} // Pass down setSelectedShop
				/>
				<button onClick={logout} className="">
					Logout
				</button>
			</aside>
			<main className="flex-1 ">{renderContent()}</main>{" "}
			{/* Conditionally render based on activeMenu */}
		</div>
	);
}
