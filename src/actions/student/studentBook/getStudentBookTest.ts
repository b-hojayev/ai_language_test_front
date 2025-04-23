"use server";

import { cookies } from "next/headers";

export const getStudentBookTest = async (bookId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/student/books/${bookId}/tests`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    return { error: data };
  } catch (error: any) {
    return { error: error.message };
  }
};
