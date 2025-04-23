"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deleteTest = async (testId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/tests/${testId}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      revalidatePath("/admin/tests");
      return "";
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
