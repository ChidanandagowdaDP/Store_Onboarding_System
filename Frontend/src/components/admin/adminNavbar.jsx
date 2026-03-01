import { NavLink } from "react-router-dom";

export default function MenuNavbar() {
  const menus = [
    { name: "All", path: "all" },
    { name: "Approval Pending", path: "approval-pending" },
    { name: "Renewal", path: "renewal" },
    { name: "Amount Pending", path: "amount-pending" },
  ];

  return (
    <nav className="sticky">
      <ul className="flex justify-around bg-white py-2">
        {menus.map((menu) => (
          <li key={menu.path}>
            <NavLink
              to={menu.path}
              className={({ isActive }) =>
                `cursor-pointer text-sm font-medium border-b-2 transition px-2 py-1 ${
                  isActive
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:text-sky-600"
                }`
              }
            >
              {menu.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
