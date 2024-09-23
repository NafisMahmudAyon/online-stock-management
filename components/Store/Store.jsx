import React from "react";
import AddUser from "./AddUser";
import Users from "./Users";
import CreateProduct from "./CreateProduct";
import AllProducts from "./AllProducts";

const Store = ({ shop, subMenu }) => {
	if (!shop) {
		return <p>No shop selected.</p>;
	}

	const renderSubMenu = () => {
		switch (subMenu) {
			case "addUser":
				return <AddUser shop={shop} />;
			case "users":
				return <Users shop={shop} />;
			case "createProduct":
				return <CreateProduct shop={shop} />;
			case "allProducts":
				return <AllProducts shop={shop} />;
			default:
				return <p>Select a sub-menu item to view content.</p>;
		}
	};

	return (
		<div>
			<h1>{shop.name}</h1>
			{renderSubMenu()}
		</div>
	);
};

export default Store;
