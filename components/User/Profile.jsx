"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "../Icon";

const Profile = () => {
	const { user } = useAuth();
	const [profileData, setProfileData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// If user exists, fetch profile details
		if (user) {
			const fetchUserProfile = async () => {
				try {
					const response = await fetch(`/api/users/${user.userDetails.id}`);
					const data = await response.json();

					if (response.ok) {
						setProfileData(data.user);
					} else {
						setError(data.error);
					}
				} catch (err) {
					setError("Failed to fetch profile data");
				} finally {
					setLoading(false);
				}
			};

			fetchUserProfile();
		}
	}, [user]);

	if (loading) {
		return <p>Loading profile...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}
	console.log(profileData);
	return (
		<div>
			{profileData ? (
					<div className="flex items-center gap-3 mb-10 px-4 py-3 rounded-[4px] transition-all duration-200 hover:bg-itemBackground ">
						{profileData.profile_photo ? (
							<img
								src={profileData.profile_photo}
								alt="Profile"
                className="size-[65px] rounded-full object-cover "
							/>
						) : (
							<Avatar className="text-menuBackground" width={65} height={65} />
						)}
						<div>
							<p>
								{profileData.first_name} {profileData.last_name}
							</p>
							<p className="text-infoColor">{profileData.email}</p>
						</div>
					</div>
			) : (
				<p>No profile data available</p>
			)}
		</div>
	);
};

export default Profile;
