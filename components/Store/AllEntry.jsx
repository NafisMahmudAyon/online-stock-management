"use client";
import React, { useEffect, useState } from "react";

const AllEntry = ({ shop }) => {
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	useEffect(() => {
		const fetchEntries = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/supplier/entry", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"shop-id": shop.id,
					},
				});

				const result = await response.json();

				if (response.ok) {
					setEntries(result.entries);
				} else {
					setError(result.error || "Failed to fetch Entries.");
				}
			} catch (err) {
				setError("Something went wrong. Please try again.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		if (shop) {
			fetchEntries();
		}
	}, [shop]);

	return (
		<div>
			{shop.name}
      {loading && "Loading..."}
			{!loading && <DataTable entries={entries} />}
		</div>
	);
};

export default AllEntry;

const parseAttributes = (attributes) => {
	try {
		const parsed = JSON.parse(attributes);
		return parsed.map((attr) => `${attr.name}: ${attr.option}`).join(", ");
	} catch (error) {
		return attributes;
	}
};

const DataTable = ({ entries }) => {
	const [filter, setFilter] = useState("");
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: "ascending",
	});
	const [filteredEntries, setFilteredEntries] = useState(entries);

	const handleFilterChange = (e) => {
		const value = e.target.value;
		setFilter(value);
		const filtered = entries.filter(
			(entry) =>
				entry.productid.toString().includes(value) ||
				entry.supplierid.toString().includes(value) ||
				entry.producttypeid.toString().includes(value) ||
				entry.purchasedate.includes(value) ||
				entry.purchaseunitprice.toString().includes(value) ||
				entry.purchasequantity.toString().includes(value)
		);
		setFilteredEntries(filtered);
	};

	const handleSort = (key) => {
		let direction = "ascending";
		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	const sortedEntries = React.useMemo(() => {
		let sortableEntries = [...filteredEntries];
		if (sortConfig.key !== null) {
			sortableEntries.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableEntries;
	}, [filteredEntries, sortConfig]);

	return (
		<div>
			<div className="mb-4">
				<input
					type="text"
					value={filter}
					onChange={handleFilterChange}
					placeholder="Filter entries"
					className="p-2 border border-gray-300 rounded w-full"
				/>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-300">
					<thead>
						<tr>
							<th
								className="py-2 px-4 border-b cursor-pointer"
								onClick={() => handleSort("entryid")}>
								Entry ID
							</th>
							<th
								className="py-2 px-4 border-b cursor-pointer"
								onClick={() => handleSort("productid")}>
								Product ID
							</th>
							<th
								className="py-2 px-4 border-b cursor-pointer"
								onClick={() => handleSort("supplierid")}>
								Supplier ID
							</th>
							<th
								className="py-2 px-4 border-b cursor-pointer"
								onClick={() => handleSort("producttypeid")}>
								Product Type ID
							</th>
							<th
								className="py-2 px-4 border-b cursor-pointer"
								onClick={() => handleSort("purchasedate")}>
								Purchase Date
							</th>
							<th
								className="py-2 px-4 border-b cursor-pointer"
								onClick={() => handleSort("purchaseunitprice")}>
								Purchase Unit Price
							</th>
							<th
								className="py-2 px-4 border-b cursor-pointer"
								onClick={() => handleSort("purchasequantity")}>
								Purchase Quantity
							</th>
							<th className="py-2 px-4 border-b">Supply Variations</th>
						</tr>
					</thead>
					<tbody>
						{sortedEntries.map((entry) => (
							<tr key={entry.entryid}>
								<td className="py-2 px-4 border-b">{entry.entryid}</td>
								<td className="py-2 px-4 border-b">{entry.productid}</td>
								<td className="py-2 px-4 border-b">{entry.supplierid}</td>
								<td className="py-2 px-4 border-b">{entry.producttypeid}</td>
								<td className="py-2 px-4 border-b">{entry.purchasedate}</td>
								<td className="py-2 px-4 border-b">
									{entry.purchaseunitprice}
								</td>
								<td className="py-2 px-4 border-b">{entry.purchasequantity}</td>
								<td className="py-2 px-4 border-b">
									{entry.supplyVariations.length > 0 ? (
										<ul>
											{entry.supplyVariations.map((variationGroup, index) => (
												<li key={index}>
													{variationGroup.map((variation) => (
														<div key={variation.supplyvariationid}>
															<p>ID: {variation.supplyvariationid}</p>
															<p>Price: {variation.purchaseprice}</p>
															<p>Quantity: {variation.purchasequantity}</p>
															<p>
																Attributes:{" "}
																{parseAttributes(variation.attributes)}
															</p>
															<p>SKU: {variation.sku}</p>
														</div>
													))}
												</li>
											))}
										</ul>
									) : (
										<p>No Variations</p>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
