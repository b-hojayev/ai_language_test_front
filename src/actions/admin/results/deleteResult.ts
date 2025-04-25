"use server";

import { cookies } from "next/headers";

export const deleteResult = async (resultId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/results/${resultId}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    });

    if (response.ok) {
      // revalidatePath("/admin/groups?page=1", "layout");
      // revalidateTag("groups");
      return "";
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
