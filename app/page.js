"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		// Check localStorage for login status
		const storedUser = localStorage.getItem("stockManage");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("stockManage");
		setUser(null);
	};

	return (
		<div>
			<h1>Welcome to the Home Page</h1>
			{user ? (
				<>
					<p>Logged in as {user.userDetails.username}</p>
					<button onClick={() => router.push("/dashboard")}>
						Go to Dashboard
					</button>
					<button onClick={handleLogout}>Logout</button>
				</>
			) : (
				<>
					<button onClick={() => router.push("/login")}>Login</button>
					<button onClick={() => router.push("/signup")}>Sign Up</button>
				</>
			)}
		</div>
	);
}

