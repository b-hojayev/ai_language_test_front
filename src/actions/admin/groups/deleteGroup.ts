"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const deleteGroup = async (groupId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/groups/${groupId}`;
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
