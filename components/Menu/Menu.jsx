import React from "react";
import MenuItem from "./MenuItem";
import { Store } from "../Icon";
import { Dashboard } from "../Icon";

const Menu = ({ activeMenu, setActiveMenu }) => {
	return (
		<div className="flex-1 w-full flex flex-col gap-2">
			<MenuItem
				title="Dashboard"
				icon={<Dashboard className="text-actionColor" width={20} />}
				active={activeMenu === "Dashboard"}
				onClick={() => setActiveMenu("Dashboard")}
			/>
			<MenuItem
				title="Create Store"
				icon={<Store className="text-actionColor" width={20} height={20} />}
				active={activeMenu === "Create Store"}
				onClick={() => setActiveMenu("Create Store")}
			/>
			<MenuItem
				title="Menu 1"
				icon={<Store className="text-actionColor" width={18} />}
				active={activeMenu === "Menu 1"}
				onClick={() => setActiveMenu("Menu 1")}
			/>
			<MenuItem
				title="Menu 2"
				icon={<Store className="text-actionColor" width={18} />}
				active={activeMenu === "Menu 2"}
				onClick={() => setActiveMenu("Menu 2")}
			/>
		</div>
	);
};

export default Menu;
