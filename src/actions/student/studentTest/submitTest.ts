"use server";

import { CompletedQuestionType } from "@/components/student/StudentTest";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const submitTest = async (
  testId: string,
  body: CompletedQuestionType[]
) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/student/tests/${testId}/submit`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    console.log("test submit response:", response);

    if (response.ok) {
      return data;
    }

    return { error: data };
  } catch (error: any) {
    console.error("test submit error:", error);
    return { error: error.message };
  }
};
