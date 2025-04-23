import { cookies } from "next/headers";

export const getSpecialities = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/specialities`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    return {
      error: data,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};
