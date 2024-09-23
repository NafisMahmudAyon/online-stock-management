"use client";
import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";
import Users from "./Users";
import CreateProduct from "./CreateProduct";
import AllProducts from "./AllProducts";
import Breadcrumbs from "../Breadcrumbs";

const Store = ({ shop, subMenu }) => {
	const [subMenuTitle, setSubMenuTitle] = useState("");

	useEffect(() => {
		const titles = {
			addUser: "Add User",
			users: "Users",
			createProduct: "Create Product",
			allProducts: "All Products",
		};
		setSubMenuTitle(titles[subMenu] || "");
	}, [subMenu]);

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
			<Breadcrumbs
				items={subMenuTitle ? [shop.name, subMenuTitle] : [shop.name]}
			/>
			{renderSubMenu()}
		</div>
	);
};

export default Store;
