"use server";

import { cookies } from "next/headers";

export const getGroups = async (page: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/groups?page=${page}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ["groups"],
      },
    });
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    return { error: data };
  } catch (error: any) {
    return { error: error.message };
  }
};
