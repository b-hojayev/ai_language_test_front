"use server";

import { BookCreateValueType } from "@/components/admin/books/BooksList";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createBook = async (body: BookCreateValueType) => {
  const formData = new FormData();

  if (!body.image) return;

  formData.append("name", body.name);
  formData.append("facultyIds", JSON.stringify(body.facultyIds));
  formData.append("image", body.image);

  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/books`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      revalidatePath("/admin/books");
      return "";
    }

    const data = response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
