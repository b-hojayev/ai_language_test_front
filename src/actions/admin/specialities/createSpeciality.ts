"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createSpeciality = async (prevStata: any, formData: FormData) => {
  const rawFormData = {
    name: formData.get("name"),
    facultyId: formData.get("facultyId"),
  };
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/specialities`;
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
    console.log("create speciality res:", response);

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
