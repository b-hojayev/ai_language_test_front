"use server";

import { QuizData } from "@/components/admin/tests/QuizEditor";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const updateTest = async (rawData: QuizData, testId: string) => {
  console.log("update....");

  const url = `${process.env.NEXT_PUBLIC_API_HOST}/admin/tests/${testId}`;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const timerInMs = +rawData.timer * 60 * 1000;
  const fillQuestions = rawData.test.fillQuestions.map((q) => ({
    question: q.question,
    correctAnswer: q.correctAnswer,
  }));
  const testQuestions = rawData.test.tests.map((q) => ({
    question: q.question,
    answerVariants: q.answerVariants.map((a) => ({
      answer: a.answer,
      isCorrect: a.isCorrect,
    })),
  }));

  const structuredBody = {
    title: rawData.title,
    bookId: +rawData.bookId,
    timer: timerInMs,
    isVisible: rawData.isVisible,
    test: {
      fillQuestions: fillQuestions,
      tests: testQuestions,
    },
  };

  console.log(structuredBody);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(structuredBody),
    });

    if (response.ok) {
      revalidatePath("/admin/tests");
      return "";
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return error.message;
  }
};
