"use server";

import { cookies } from "next/headers";

export const getSingleTest = async (testId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/tests/${testId}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
