"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deleteStudent = async (studentId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/students/${studentId}`;
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
      revalidatePath("/admin/students");
      return "";
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
