// /contexts/UserContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Check if user is already logged in
		const token = localStorage.getItem("token");
		if (token) {
			// Fetch user data using the token (assuming you have an endpoint for this)
			fetchUserData(token).then((userData) => setUser(userData));
		}
	}, []);

	const fetchUserData = async (token) => {
		const response = await fetch("/api/auth/me", {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = await response.json();
		return data.user;
	};

	const login = async (email, password) => {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
			headers: { "Content-Type": "application/json" },
		});
		const result = await response.json();
		if (response.ok) {
			localStorage.setItem("token", result.token);
			setUser(await fetchUserData(result.token));
		}
		return result;
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export const useUser = () => useContext(UserContext);
