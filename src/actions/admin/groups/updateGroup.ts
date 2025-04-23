"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const updateGroup = async (
  groupId: string,
  form: {
    group_number: string;
    faculty_id: string;
    speciality_id: string;
    study_year: string;
  }
) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const year = currentMonth <= 8 ? currentYear - +form.study_year : currentYear;

  const rawData = {
    groupNumber: +form.group_number,
    studyYear: year,
    facultyId: +form.faculty_id,
    specialityId: +form.speciality_id,
  };

  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/groups/${groupId}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(rawData),
    });

    if (response.ok) {
      revalidatePath("/admin/groups");
      return "";
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
