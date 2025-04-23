"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const editFaculty = async ({
  id,
  name,
}: {
  id: number;
  name: string;
}) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/faculties/${id}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const body = JSON.stringify({ name });

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (response.ok) {
      revalidatePath("/admin/faculties");
      return "";
    }

    const data = response.json();
    return data;
  } catch (error: any) {
    console.log(error);
    return error.message;
  }
};
