import AdminSidebar from "@/components/admin/AdminSidebar";
import React from "react";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="w-full h-full flex relative overflow-hidden">
      <AdminSidebar />
      <section className="w-full ml-64">{children}</section>
    </main>
  );
};

export default AdminLayout;
