import { cookies } from "next/headers";

export const getFaculties = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/admin/faculties`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log("faculty data:", data);

    if (response.ok) {
      return data;
    } else {
      return { error: data };
    }
  } catch (error: any) {
    console.log("faculty catch error:", error);

    return { error: error.message };
  }
};
