"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deleteFaculy = async (id: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/faculties/${id}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("delete faculty response:", response);

    if (response.ok) {
      revalidatePath("/admin/faculties");
      return { error: "" };
    } else {
      const data = await response.json();
      return { error: data };
    }
  } catch (error: any) {
    console.error("delete faculty error:", error);

    return { error: error.message };
  }
};
