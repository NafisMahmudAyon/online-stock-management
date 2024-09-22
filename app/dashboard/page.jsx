// app/dashboard/page.js
"use client";
import React from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	const { user, logout } = useAuth();
	const router = useRouter();

	if (!user) {
		return <p>Loading...</p>; // Alternatively, redirect to login if necessary
	}

	return (
		<div>
				{/* <AuthProvider> */}
				<h1>Welcome to the Dashboard, 
					{user.userDetails.username}
					!</h1>
				<button onClick={logout}>Logout</button>
				{/* </AuthProvider> */}
			</div>
	);
}
