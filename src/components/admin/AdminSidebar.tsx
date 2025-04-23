"use client";

import { BookOpen, Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Fakultetler", icon: Home, path: "/admin/faculties" },
  { name: "Hünärler", icon: BookOpen, path: "/admin/specialities" },
  { name: "Toparlar", icon: Users, path: "/admin/groups" },
  { name: "Talyplar", icon: BookOpen, path: "/admin/students" },
  { name: "Kitaplar", icon: BookOpen, path: "/admin/books" },
  { name: "Test", icon: BookOpen, path: "/admin/tests" },
  { name: "Netijeler", icon: BookOpen, path: "/admin/results" },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg p-5 h-screen fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                pathname === item.path
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
