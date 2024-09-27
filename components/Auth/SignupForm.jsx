"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/createClient"; // Ensure this is configured correctly

export default function SignupForm() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		first_name: "",
		last_name: "",
		gender: "",
		profile_photo: "", // URL string
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
	const [isEmailAvailable, setIsEmailAvailable] = useState(true);
	const [profilePhotoFile, setProfilePhotoFile] = useState(null);

	const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
	const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

	// Basic form validation
	const validate = () => {
		const validationErrors = {};
		const { username, email, password, profile_photo } = formData;

		if (!username) validationErrors.username = "Username is required";
		if (!email) validationErrors.email = "Email is required";

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email))
			validationErrors.email = "Invalid email format";

		if (!password) validationErrors.password = "Password is required";
		if (password.length < 6)
			validationErrors.password = "Password must be at least 6 characters";

		if (profilePhotoFile) {
			const fileTypes = ["image/jpeg", "image/png", "image/gif"];
			if (!fileTypes.includes(profilePhotoFile.type))
				validationErrors.profile_photo = "Invalid file type";
			if (profilePhotoFile.size > 2 * 1024 * 1024)
				validationErrors.profile_photo = "File size must be less than 2MB";
		}

		return validationErrors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (name === "username") checkUsernameAvailability(value);
		if (name === "email") checkEmailAvailability(value);
	};

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		setProfilePhotoFile(file);
	};

	const checkUsernameAvailability = async (username) => {
		const { data, error } = await supabase
			.from("users")
			.select("id")
			.eq("username", username);

		if (error) {
			console.error("Error checking username:", error);
		}

		if (data.length > 0) {
			setIsUsernameAvailable(false);
			setErrors((prev) => ({ ...prev, username: "Username already exists" }));
		} else {
			setIsUsernameAvailable(true);
			setErrors((prev) => ({ ...prev, username: null }));
		}
	};

	const checkEmailAvailability = async (email) => {
		const { data, error } = await supabase
			.from("users")
			.select("id")
			.eq("email", email);

		if (error) {
			console.error("Error checking email:", error);
		}

		if (data.length > 0) {
			setIsEmailAvailable(false);
			setErrors((prev) => ({ ...prev, email: "Email already exists" }));
		} else {
			setIsEmailAvailable(true);
			setErrors((prev) => ({ ...prev, email: null }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		if (!isUsernameAvailable || !isEmailAvailable) {
			setErrors((prev) => ({
				...prev,
				apiError: "Please fix the errors before submitting",
			}));
			return;
		}

		setIsSubmitting(true);

		let profile_photo = formData.profile_photo; // Default to the existing URL if no new photo

		// Handle profile photo upload if exists
		if (profilePhotoFile) {
			const photoFormData = new FormData();
			photoFormData.append("file", profilePhotoFile);
			photoFormData.append("upload_preset", uploadPreset);

			try {
				const uploadRes = await fetch(cloudinaryUploadUrl, {
					method: "POST",
					body: photoFormData,
				});
				const uploadData = await uploadRes.json();

				if (!uploadRes.ok) {
					throw new Error("Error uploading profile photo.");
				}

				profile_photo = uploadData.secure_url;
			} catch (error) {
				console.error("Photo upload error:", error);
				setErrors((prev) => ({
					...prev,
					apiError: "Error uploading profile photo.",
				}));
				setIsSubmitting(false);
				return;
			}
		}
		let signupData = { ...formData, profile_photo };
		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				body: JSON.stringify(signupData),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const result = await response.json();

			if (response.ok) {
				console.log("User signed up successfully:", result);
				setFormData({
					username: "",
					email: "",
					password: "",
					first_name: "",
					last_name: "",
					gender: "",
					profile_photo: "", // Reset profile photo URL
				});
			} else {
				setErrors({ apiError: result.error });
			}
		} catch (error) {
			setErrors({ apiError: "Error during signup" });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="username"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
				required
			/>
			{errors.username && <p className="error">{errors.username}</p>}

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

			<input
				type="text"
				name="first_name"
				placeholder="First Name"
				value={formData.first_name}
				onChange={handleChange}
			/>

			<input
				type="text"
				name="last_name"
				placeholder="Last Name"
				value={formData.last_name}
				onChange={handleChange}
			/>

			<select name="gender" onChange={handleChange} value={formData.gender}>
				<option value="">Select Gender</option>
				<option value="male">Male</option>
				<option value="female">Female</option>
				<option value="other">Other</option>
			</select>

			<input type="file" name="profile_photo" onChange={handlePhotoChange} />
			{errors.profile_photo && <p className="error">{errors.profile_photo}</p>}

			{errors.apiError && <p className="error">{errors.apiError}</p>}

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Submitting..." : "Sign Up"}
			</button>
		</form>
	);
}
