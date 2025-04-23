"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deleteBook = async (bookId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/books/${bookId}`;
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
      revalidatePath("/admin/books");
      return "";
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
