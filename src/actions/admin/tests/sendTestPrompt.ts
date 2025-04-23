"use server";

import { NewTestPromptValue } from "@/components/admin/tests/TestList";
import { cookies } from "next/headers";

export const sendTestPrompt = async (body: NewTestPromptValue) => {
  const bodyData = {
    prompt: body.prompt,
    testQuestionCount: +body.testQuestionCount,
    fillQuestionCount: +body.fillQuestionCount,
  };

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/tests/prompt`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify(bodyData),
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
