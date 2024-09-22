"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Profile from "@/components/User/Profile";
import Menu from "@/components/Menu/Menu";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import CreateStore from "@/components/Store/CreateStore";

export default function Dashboard() {
	const { user, logout } = useAuth();
	const router = useRouter();
	const [activeMenu, setActiveMenu] = useState("Dashboard");

	if (!user) {
		return <p>Loading...</p>; // Alternatively, redirect to login if necessary
	}

	// Handle what to render based on activeMenu
	const renderContent = () => {
		switch (activeMenu) {
			case "Create Store":
				return <CreateStore />;
			case "Menu 1":
				return <p>Content for Menu 1</p>;
			case "Menu 2":
				return <p>Content for Menu 2</p>;
			default:
				return <DashboardContent />;
		}
	};

	return (
		<div className="flex gap-8 text-mainColor ">
			<aside className="w-[360px] px-4 py-10 flex flex-col items-start h-[100vh] ">
				<Profile />
				<Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />{" "}
				{/* Pass setActiveMenu */}
				<button onClick={logout} className="">
					Logout
				</button>
			</aside>
			<main>{renderContent()}</main>{" "}
			{/* Conditionally render based on activeMenu */}
		</div>
	);
}
