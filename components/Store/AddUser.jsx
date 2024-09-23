import React, { useState } from "react";
import Input from "../Form/Input";
import Select from "../Form/Select";

const AddUser = ({ shop }) => {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("manager");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		try {
			const response = await fetch("/api/shops/role", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					shopId: shop.id,
					email,
					role,
				}),
			});

			const data = await response.json();
			console.log(data);

			if (!response.ok) {
				setError(data.error || "Failed to assign role.");
			} else {
				setSuccess(`Role assigned successfully to ${email}.`);
				setEmail(""); // Reset email field
				setRole("manager"); // Reset role field
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="">
			<h2 className="text-2xl font-semibold mb-4">Add User to {shop.name}</h2>

			{error && <div className="bg-red-200 text-red-800 p-2 mb-4">{error}</div>}
			{success && (
				<div className="bg-green-200 text-green-800 p-2 mb-4">{success}</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Email input */}
				<Input
					id="email"
					type="email"
					label="User Email"
					required={true}
					placeholder="Enter User Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{/* <div>
					<label htmlFor="email" className="block text-sm font-medium">
						User Email
					</label>
					<input
						type="email"
						id="email"
						className="mt-1 block w-full p-2 border rounded"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div> */}

				{/* Role selection */}
				<Select
					id="email"
					type="email"
					label="Role"
					required={true}
					placeholder=""
					value={role}
					onChange={(e) => setRole(e.target.value)}>
					<option value="owner">Owner</option>
					<option value="manager">Manager</option>
					<option value="staff">Staff</option>
				</Select>
				{/* <div>
					<label htmlFor="role" className="block text-sm font-medium">
						Role
					</label>
					<select
						id="role"
						className="mt-1 block w-full p-2 border rounded"
						value={role}
						onChange={(e) => setRole(e.target.value)}>
						<option value="owner">Owner</option>
						<option value="manager">Manager</option>
						<option value="staff">Staff</option>
					</select>
				</div> */}

				{/* Submit button */}
				<div>
					<button
						type="submit"
						className="flex bg-buttonBackground text-mainColor font-semibold py-2 px-4 rounded-md"
						disabled={loading}>
						{loading ? "Adding User Role..." : "Add User Role"}
					</button>
				</div>
				{/* <button
					type="submit"
					className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
					Add User
				</button> */}
			</form>
		</div>
	);
};

export default AddUser;
