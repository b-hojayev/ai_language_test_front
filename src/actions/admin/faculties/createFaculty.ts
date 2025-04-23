"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createFaculty = async (prevStata: any, formData: FormData) => {
  const rawFormData = {
    name: formData.get("name"),
  };
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/faculties`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(rawFormData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("create faculty response:", response);
    if (response.ok) {
      revalidatePath("/admin/faculties");
      return { error: "" };
    }
    const data = await response.json();
    return { error: data };
  } catch (error: any) {
    console.error("create faculty error:", error);
    return { error: error.message };
  }
};
