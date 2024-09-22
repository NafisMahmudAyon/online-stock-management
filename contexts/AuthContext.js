// contexts/AuthContext.js
"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const router = useRouter();
// console.log(user)
	useEffect(() => {
		// Check if user is stored in localStorage
		const storedUser = localStorage.getItem("stockManage");
		console.log(storedUser)
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			router.push("/login");
		}
	}, [router]);

	const logout = () => {
		localStorage.removeItem("stockManage");
		setUser(null);
		router.push("/login");
	};

	return (
		<AuthContext.Provider value={{ user, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
