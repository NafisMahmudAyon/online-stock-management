"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginForm() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	// Basic form validation
	const validate = () => {
		const validationErrors = {};
		const { email, password } = formData;

		if (!email) validationErrors.email = "Email is required";
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email))
			validationErrors.email = "Invalid email format";

		if (!password) validationErrors.password = "Password is required";

		return validationErrors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const result = await response.json();
			if (response.ok) {
				// Store user data in localStorage (e.g., user ID and email)
				const existingData =
					JSON.parse(localStorage.getItem("stockManage")) || {};

				// Merge the existing data with new userDetails
				const updatedData = {
					...existingData,
					userDetails: result.userData.userDetails,
				};

				// Save the updated data in localStorage
				localStorage.setItem("stockManage", JSON.stringify(updatedData));

				// Redirect to /dashboard
				router.push("/dashboard");
			} else {
				setErrors({ apiError: result.error });
			}
		} catch (error) {
			console.error("Login error:", error);
			setErrors({ apiError: "Error during login" });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				required
			/>
			{errors.email && <p className="error">{errors.email}</p>}

			<input
				type="password"
				name="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
				required
			/>
			{errors.password && <p className="error">{errors.password}</p>}

			{errors.apiError && <p className="error">{errors.apiError}</p>}

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Logging in..." : "Log In"}
			</button>
		</form>
	);
}
