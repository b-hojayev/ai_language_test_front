"use server";

import { BookCreateValueType } from "@/components/admin/books/BooksList";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const updateBook = async (bookId: string, body: BookCreateValueType) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/books/${bookId}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
