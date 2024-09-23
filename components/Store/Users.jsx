import React, { useEffect, useState } from "react";

const Users = ({ shop }) => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/shops/role/users", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ shopId: shop.id }),
				});

				const data = await res.json();

				if (res.ok) {
					setUsers(data);
				} else {
					setError(data.error || "Failed to fetch users");
				}
			} catch (error) {
				setError("An error occurred while fetching users");
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, [shop.id]);

	if (loading) {
		return <p>Loading users...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div>
			<h2>Users in {shop.name}</h2>
			<ul>
				{users.map((user, index) => (
					<li key={index} className="user-item">
						{user.userExist ? (
							<div>
								<img
									src={user.profilePhoto || "/default-avatar.png"}
									alt={`${user.firstName} ${user.lastName}`}
									width={50}
									height={50}
									style={{ borderRadius: "50%" }}
								/>
								<p>
									{user.firstName} {user.lastName} ({user.role})
								</p>
								<p>Email: {user.userEmail}</p>
							</div>
						) : (
							<div>
								<p>
									Email: {user.userEmail} (Role: {user.role})
								</p>
								<p>User does not exist in the system.</p>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Users;
