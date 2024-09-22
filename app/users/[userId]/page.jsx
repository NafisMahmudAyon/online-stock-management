// Example React Component

import React, { useEffect, useState } from "react";

export default function UserProfile({ userId }) {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const response = await fetch(`/api/users/${userId}`);
				const result = await response.json();

				if (response.ok) {
					setUser(result.user);
				} else {
					setError(result.error);
				}
			} catch (err) {
				setError("Error fetching user data");
			}
		}

		fetchUser();
	}, [userId]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>User Profile</h1>
			<p>ID: {user.id}</p>
			<p>Username: {user.username}</p>
			<p>Email: {user.email}</p>
			<p>Created At: {user.created_at}</p>
			<p>Updated At: {user.updated_at}</p>
		</div>
	);
}
