import React from "react";

const Store = ({ shop }) => {
	if (!shop) {
		return <p>No shop selected.</p>;
	}

	return (
		<div>
			<h1>{shop.name}</h1>
			<p>Owner: {shop.owner_id}</p>
			<p>Slug: {shop.slug}</p>
			<p>ID: {shop.id}</p>
			{/* Render other details about the shop */}
		</div>
	);
};

export default Store;
