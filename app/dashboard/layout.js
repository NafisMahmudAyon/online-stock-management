"use client";
import { AuthProvider } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
	return (
		<AuthProvider>
			<div className="flex gap-8 text-mainColor justify-start px-6 ">
				{children}
			</div>
		</AuthProvider>
	);
}
