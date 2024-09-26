"use client";
import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";
import Users from "./Users";
import CreateProduct from "./CreateProduct";
import AllProducts from "./AllProducts";
import Breadcrumbs from "../Breadcrumbs";
import CreateSupplier from "./CreateSupplier";
import AllSuppliers from "./AllSuppliers"; // Ensure this component exists

const Store = ({ shop, subMenu, setSubMenu }) => {
	const [subMenuTitle, setSubMenuTitle] = useState("");
	console.log(subMenu)

	useEffect(() => {
		const titles = {
			addUser: "Add User",
			users: "Users",
			createProduct: "Create Product",
			allProducts: "All Products",
			allSuppliers: "All Suppliers", // New submenu title
		};
		setSubMenuTitle(titles[subMenu] || "");
	}, [subMenu]);

	if (!shop) {
		return <p>No shop selected.</p>;
	}

	// Function to switch to "All Suppliers" submenu after creating a supplier
	const handleSupplierCreated = () => {
		setSubMenu("allSuppliers");
	};

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
			case "addSupplier":
				return (
					<CreateSupplier
						shop={shop}
						onSupplierCreated={handleSupplierCreated}
					/>
				);
			case "allSuppliers":
				return <AllSuppliers shop={shop} />; // AllSuppliers component for listing suppliers
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
