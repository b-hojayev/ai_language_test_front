"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useCheckAuth = () => {
  const pathname = usePathname();
  const router = useRouter();

  console.log(pathname);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!sessionStorage.getItem("token") || !sessionStorage.getItem("role")) {
      router.push("/login");
      return;
    }

    if (
      sessionStorage.getItem("role") !== "admin" &&
      sessionStorage.getItem("role") !== "student"
    ) {
      sessionStorage.clear();
      router.push("/login");

      return;
    }

    if (
      sessionStorage.getItem("role") === "admin" &&
      !pathname.startsWith("/admin")
    ) {
      router.push("/admin");
      return;
    }

    if (
      sessionStorage.getItem("role") === "student" &&
      pathname.startsWith("/admin")
    ) {
      sessionStorage.clear();
      router.push("/login");
      return;
    }

    setIsLoading(false);
  }, []);

  return { isLoading };
};
