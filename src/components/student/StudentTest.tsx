"use client";

import { submitTest } from "@/actions/student/studentTest/submitTest";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

type QuestionType = "test" | "fill_blank";

export type AnswerVariant = {
  id: string;
  answer: string;
};

export type QuestionItem = {
  id: string;
  question: string;
  questionType: QuestionType;
  answerVariants: AnswerVariant[];
};

export type CompletedQuestionType = {
  questionId: string;
  correctAnswer: string | null;
  answerId: string | null;
};

type TestResult = {
  totalQuestions: number;
  correctCount: number;
  score: string;
  feedback: string;
};

const StudentTest = ({
  questions,
  timer,
}: {
  questions: QuestionItem[];
  timer: string;
}) => {
  const { testId } = useParams<{ testId: string }>();
  const [completedQuestions, setCompletedQuestions] = useState<
    CompletedQuestionType[]
  >([]);
  const [isAnswerVisible, setIsAnswerVisible] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(+timer);
  const [timeFinished, setTimeFinished] = useState<boolean>(false);
  console.log(completedQuestions);

  // Format ms to mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeFinished(true);
      return;
    }

    if (!isAnswerVisible && !isLoading) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1000);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  const handleTestQuestion = (questionId: string, answerId: string) => {
    const question = completedQuestions.find(
      (item) => item.questionId === questionId
    );

    setCompletedQuestions((prev) => {
      if (question) {
        const filteredQuestions = prev.filter(
          (item) => item.questionId !== question.questionId
        );

        return [
          ...filteredQuestions,
          { answerId, questionId, correctAnswer: null },
        ];
      } else {
        return [...prev, { answerId, questionId, correctAnswer: null }];
      }
    });
  };

  const handleFillQuestion = (questionId: string, answer: string) => {
    const question = completedQuestions.find(
      (item) => item.questionId === questionId
    );

    setCompletedQuestions((prev) => {
      if (question) {
        const filteredQuestions = prev.filter(
          (item) => item.questionId !== question.questionId
        );

        if (answer) {
          return [
            ...filteredQuestions,
            { answerId: null, questionId, correctAnswer: answer },
          ];
        } else {
          return filteredQuestions;
        }
      } else {
        return [...prev, { answerId: null, questionId, correctAnswer: answer }];
      }
    });
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    setIsLoading(true);

    if (!testId) return;

    const testAnswer = await submitTest(testId, completedQuestions);
    setAlertModal(false);

    if (testAnswer.error) {
      //error
    }

    setTestResult({
      correctCount: testAnswer.correctCount,
      score: testAnswer.score,
      totalQuestions: testAnswer.totalQuestions,
      feedback: testAnswer.aiFeedback,
    });
    setIsAnswerVisible(true);

    console.log("test....", testAnswer);

    setIsLoading(false);
  };

  return (
    <div className="w-full min-h-screen relative grid">
      <div className="flex h-full">
        <div className="w-[25%] fixed left-0 top-0 h-full bg-[url('/student/sidebar.jpg')] bg-cover bg-no-repeat pt-[30px] pr-[40px] pb-[60px] pl-[50px]">
          <div className="relative h-full">
            <div className="flex items-center h-auto relative z-10 text-white">
              LOGO
            </div>

            <div className="absolute left-0 bottom-0 w-full">
              <div className="text-[23px] text-white font-bold mb-[15px] transition-all duration-300">
                {formatTime(timeLeft)}
              </div>

              <div className="text-[23px] text-white font-bold mb-[15px] transition-all duration-300">
                <span>
                  {(completedQuestions.length / questions.length) * 100}%
                </span>{" "}
                Complete
              </div>

              <div className="w-[80%] bg-[rgb(180,200,232)] h-[19px] rounded-[25px]">
                <div
                  style={{
                    width: `${
                      (completedQuestions.length / questions.length) * 100
                    }%`,
                  }}
                  className="bg-[rgb(0,144,157)] rounded-[25px] h-full transition-all duration-300 w-[0%]"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-[25%] w-full h-full bg-[url('/student/bg.jpg')] bg-cover relative">
          <Image
            alt="bg-img"
            src={`/student/pr.png`}
            className="absolute right-0 top-0"
            width={260}
            height={260}
          />

          <div className="pt-[100px] pb-[60px] mx-auto w-[60%]">
            {isAnswerVisible ? (
              <Card className="max-w-xl mx-auto mt-10 p-6 shadow-xl rounded-2xl bg-white">
                <CardContent className="space-y-4">
                  <h2 className="text-3xl font-bold text-center text-gray-800">
                    Test Results
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-500">Total Questions</p>
                      <p className="text-xl font-semibold">
                        {testResult?.totalQuestions}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Correct Answers</p>
                      <p className="text-xl font-semibold">
                        {testResult?.correctCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Score</p>
                      <p className="text-xl font-semibold">
                        {testResult?.score}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Feedback
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {testResult?.feedback}
                    </p>
                  </div>

                  <Link href={"/student"}>
                    <button className="mt-4 p-2 cursor-pointer rounded-[12px] bg-[rgb(247,144,49)] hover:opacity-80 w-full text-[20px] border-0 relative text-white font-bold overflow-hidden transition-all duration-500">
                      Go Back
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {questions.map((question, index) => {
                  if (question.questionType === "fill_blank") {
                    return (
                      <FillBlankQuestion
                        questionId={question.id}
                        index={index}
                        question={question.question}
                        total={questions.length}
                        key={question.id}
                        handleChange={handleFillQuestion}
                        inputValue={
                          completedQuestions.find(
                            (item) => item.questionId === question.id
                          )?.correctAnswer || ""
                        }
                      />
                    );
                  }
                  if (question.questionType === "test") {
                    return (
                      <TestQuestion
                        questionId={question.id}
                        handleTestChange={handleTestQuestion}
                        answerVariants={question.answerVariants}
                        index={index}
                        question={question.question}
                        total={questions.length}
                        key={question.id}
                        selectedAnswerId={
                          completedQuestions.find(
                            (item) => item.questionId === question.id
                          )?.answerId
                        }
                      />
                    );
                  }
                })}

                <div className="flex items-center justify-center w-[90%] mt-[50px]">
                  <button
                    onClick={() => setAlertModal(true)}
                    type="button"
                    disabled={isLoading}
                    className="cursor-pointer rounded-[12px] bg-[rgba(247,144,49,1)] hover:opacity-80 w-full h-[54px] text-[20px] border-0 relative text-white font-bold overflow-hidden transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    Submit
                  </button>
                </div>

                {alertModal && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="w-full absolute top-0 left-0  h-full z-0 bg-black opacity-30" />

                    <div className="z-10 bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
                      <h2 className="text-xl font-semibold text-center mb-4">
                        Are you sure?
                      </h2>
                      <div className="flex justify-center gap-4">
                        <button
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          type="submit"
                        >
                          {isLoading ? "Loading..." : "Yes"}
                        </button>
                        <button
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                          onClick={() => setAlertModal(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {timeFinished && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="w-full absolute top-0 left-0  h-full z-0 bg-black opacity-30" />

                    <div className="z-10 bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                      <h2 className="text-2xl font-bold mb-4">Time's Up!</h2>
                      <p className="mb-6">
                        Your time to complete the test has finished.
                      </p>
                      <button
                        disabled={isLoading}
                        onClick={() => handleSubmit()}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                      >
                        {isLoading ? "Loading..." : "OK"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTest;

const letters = ["A", "B", "C", "D"];

type TestQuestionProps = {
  question: string;
  answerVariants: AnswerVariant[];
  index: number;
  total: number;
  questionId: string;
  handleTestChange: (questionId: string, answerId: string) => void;
  selectedAnswerId: string | null | undefined;
};

const TestQuestion = ({
  question,
  answerVariants,
  index,
  total,
  questionId,
  handleTestChange,
  selectedAnswerId,
}: TestQuestionProps) => {
  return (
    <section className="w-[90%]">
      <div className="bg-[rgb(0,144,157)] rounded-[50px] w-[156px] h-[41px] text-[15px] text-white text-center leading-[41px] mb-[15px]">
        Question {index + 1}/{total}
      </div>

      <div className="text-[45px] text-[rgb(24,24,24)] font-bold leading-[45px] mb-[30px]">
        {question}
      </div>

      <div className="border border-[rgb(221,221,221)] border-l-0 border-r-0 py-[30px]">
        {answerVariants.map((variant, i) => (
          <div
            key={variant.id}
            className="relative w-full h-[84px] mb-[20px] py-[10px] px-[20px]"
          >
            <input
              onChange={() => handleTestChange(questionId, variant.id)}
              type="radio"
              name={`question-${index}`}
              className={`appearance-none rounded-[4px] bg-white shadow-[0_3px_32px_0_rgba(159,159,159,0.1)] absolute left-0 top-0 w-full h-full cursor-pointer transition-all duration-300 border-2  ${
                selectedAnswerId === variant.id
                  ? "border-[rgb(249,183,27)]"
                  : "border-transparent"
              }`}
            />
            <label className="text-[25px] text-[rgb(53,53,53)] font-bold relative z-10 pointer-events-none h-[63px]">
              <span className="rounded-[4px] shadow-[0_3px_32px_0_rgba(159,159,159,0.1)] inline-block w-[62px] text-[20px] font-bold text-center pointer-events-none leading-[63px] mr-[30px] bg-[rgb(255,244,218)] text-[rgb(249,183,27)]">
                {letters[i]}
              </span>
              {variant.answer}
            </label>
          </div>
        ))}
      </div>
    </section>
  );
};

type FillBlankType = {
  question: string;
  index: number;
  total: number;
  questionId: string;
  handleChange: (questionId: string, answer: string) => void;
  inputValue: string;
};

const FillBlankQuestion = ({
  question,
  questionId,
  index,
  total,
  handleChange,
  inputValue,
}: FillBlankType) => {
  return (
    <section className="w-[90%]">
      <div className="bg-[rgb(0,144,157)] rounded-[50px] w-[156px] h-[41px] text-[15px] text-white text-center leading-[41px] mb-[15px]">
        Question {index + 1}/{total}
      </div>

      <div className="text-[45px] text-[rgb(24,24,24)] font-bold leading-[45px] mb-[30px]">
        {question}
      </div>

      <input
        value={inputValue}
        onChange={(e) => handleChange(questionId, e.target.value)}
        type="text"
        placeholder="Type your answer here..."
        className="w-full border border-gray-300 px-4 py-3 rounded-lg text-[20px]"
      />
    </section>
  );
};
