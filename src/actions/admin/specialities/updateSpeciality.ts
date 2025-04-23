"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const updateSpeciality = async (prevStata: any, formData: FormData) => {
  const specId = formData.get("specId");
  const rawFormData = {
    name: formData.get("name"),
    facultyId: formData.get("facultyId"),
  };
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/specialities/${specId}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: JSON.stringify(rawFormData),
    });

    if (response.ok) {
      revalidatePath("/admin/specialities");
      return { error: "" };
    }
    const data = response.json();
    return { error: data };
  } catch (error: any) {
    return { error: error.message };
  }
};
