"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deleteSpeciality = async (specialityId: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/specialities/${specialityId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      revalidatePath("/admin/specialities");
      return "";
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
