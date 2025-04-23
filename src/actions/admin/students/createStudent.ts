"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createStudent = async (body: {
  facultyId: string;
  specialityId: string;
  groupId: string;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
}) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/students`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      revalidatePath("/admin/students");
      return "";
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
