"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (prevStata: any, formData: FormData) => {
  let redirectPath = null;

  const rawFormData = {
    name: formData.get("name"),
    password: formData.get("password"),
  };

  const url = `${process.env.NEXT_PUBLIC_API_HOST}/auth/login`;
  const fetchParams = {
    method: "POST",
    body: JSON.stringify(rawFormData),
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, fetchParams);
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return { message: data };
    }

    const cookieStore = await cookies();
    const cookieParams: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    };

    cookieStore.set("token", data.token, cookieParams);
    cookieStore.set("role", data.role, cookieParams);

    if (data.role === "admin") {
      redirectPath = "/admin/faculties";
    } else {
      redirectPath = "/student";
    }
  } catch (error: any) {
    return { message: error.message };
  }

  redirect(redirectPath);
};
