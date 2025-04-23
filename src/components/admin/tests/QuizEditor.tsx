"use client";

import { useState } from "react";
import { Book } from "../books/BooksList";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { createTest } from "@/actions/admin/tests/createTest";
import { updateTest } from "@/actions/admin/tests/updateTest";

interface FillQuestion {
  id: number;
  question: string;
  correctAnswer: string;
}

interface AnswerVariant {
  id: number;
  answer: string;
  isCorrect: boolean;
}

interface TestQuestion {
  id: number;
  question: string;
  answerVariants: AnswerVariant[];
}

export interface QuizData {
  title: string;
  bookId: string;
  timer: string;
  isVisible: boolean;
  test: {
    fillQuestions: FillQuestion[];
    tests: TestQuestion[];
  };
}

export default function QuizEditor({
  initialData,
  books,
  onClose,
  isFromEdit,
  testId,
}: {
  initialData: QuizData;
  books: Book[];
  onClose?: () => void;
  isFromEdit: boolean;
  testId?: string;
}) {
  const [quizData, setQuizData] = useState<QuizData>(initialData);
  const [error, setError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const handleFillQuestionChange = (
    id: number,
    field: string,
    value: string
  ) => {
    setQuizData((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        fillQuestions: prev.test.fillQuestions.map((q) =>
          q.id === id ? { ...q, [field]: value } : q
        ),
      },
    }));
  };

  const handleTestQuestionChange = (id: number, value: string) => {
    setQuizData((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        tests: prev.test.tests.map((q) =>
          q.id === id ? { ...q, question: value } : q
        ),
      },
    }));
  };

  const handleAnswerVariantChange = (
    questionId: number,
    answerId: number,
    field: string,
    value: string | boolean
  ) => {
    const isRadio = typeof value === "boolean";

    setQuizData((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        tests: prev.test.tests.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answerVariants: q.answerVariants.map((a) =>
                  a.id === answerId
                    ? {
                        ...a,
                        [field]: value,
                      }
                    : isRadio
                    ? { ...a, isCorrect: false }
                    : a
                ),
              }
            : q
        ),
      },
    }));
  };

  const addFillQuestion = () => {
    const newId =
      quizData.test.fillQuestions[quizData.test.fillQuestions.length - 1].id +
      1;
    setQuizData((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        fillQuestions: [
          ...prev.test.fillQuestions,
          { id: newId, correctAnswer: "", question: "" },
        ],
      },
    }));
  };

  const addTestQuestion = () => {
    const newId = quizData.test.tests[quizData.test.tests.length - 1].id + 1;
    setQuizData((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        tests: [
          ...prev.test.tests,
          {
            id: newId,
            question: "",
            answerVariants: [{ id: 1, answer: "", isCorrect: false }],
          },
        ],
      },
    }));
  };

  const addAnswerVariant = (questionId: number) => {
    let newId = null;

    const question = quizData.test.tests.find((item) => item.id === questionId);

    if (question?.answerVariants.length === 0) {
      newId = 1;
    } else {
      const lastAnswerId =
        question?.answerVariants[question.answerVariants.length - 1].id;
      newId = lastAnswerId ? lastAnswerId + 1 : 1;
    }

    if (!newId) return;

    setQuizData((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        tests: prev.test.tests.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answerVariants: [
                  ...q.answerVariants,
                  { id: newId, answer: "", isCorrect: false },
                ],
              }
            : q
        ),
      },
    }));
  };

  const deleteFillQuestion = (id: number) => {
    setQuizData((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        fillQuestions: prev.test.fillQuestions.filter((q) => q.id !== id),
      },
    }));
  };

  const deleteTestQuestion = (id: number) => {
    setQuizData((prev) => ({
      ...prev,
      test: { ...prev.test, tests: prev.test.tests.filter((q) => q.id !== id) },
    }));
  };

  const deleteAnswerVariant = (questionId: number, answerId: number) => {
    setQuizData((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        tests: prev.test.tests.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answerVariants: q.answerVariants.filter(
                  (a) => a.id !== answerId
                ),
              }
            : q
        ),
      },
    }));
  };

  const handleSave = async () => {
    setError("");
    setEditSuccess("");

    if (isFromEdit) {
      if (testId) {
        const isError = await updateTest(quizData, testId);

        if (isError) {
          setError(isError);
        } else {
          setEditSuccess("updated");
        }
      }
    } else {
      const isError = await createTest(quizData);

      if (isError) {
        setError(isError);
      } else {
        if (onClose) {
          onClose();
        }
      }
    }
  };

  console.log(quizData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quiz Editor</h1>

      <div className="mb-8">
        <Label className="mt-2" htmlFor="title">
          Title
        </Label>
        <input
          value={quizData.title}
          onChange={(e) => {
            setQuizData((prev) => ({ ...prev, title: e.target.value }));
          }}
          name="title"
          id="title"
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
        />

        <Label className="mt-2" htmlFor="faculty">
          Book
        </Label>
        <Select
          name="facultyId"
          value={quizData.bookId}
          onValueChange={(value) =>
            setQuizData((prev) => ({ ...prev, bookId: value }))
          }
        >
          <SelectTrigger id="faculty" className="w-full mt-2 cursor-pointer">
            <SelectValue placeholder="Select Book" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Books</SelectLabel>
              {books.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Label className="mt-2">Minuty</Label>

        <Input
          className="mt-1"
          value={quizData.timer}
          onChange={(e) =>
            setQuizData((prev) => {
              const newValue = e.target.value;
              if (/^\d*$/.test(newValue)) {
                return { ...prev, timer: newValue };
              }
              return prev;
            })
          }
          type="text"
          min={0}
          placeholder="Enter time in minutes"
        />

        <RadioGroup
          value={`${quizData.isVisible}`}
          onValueChange={(value) =>
            setQuizData((prev) => ({
              ...prev,
              isVisible: value === "true" ? true : false,
            }))
          }
          defaultValue="true"
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="r1" />
            <Label htmlFor="r1">Gorkez</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="r2" />
            <Label htmlFor="r2">Gizle</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Fill-in-the-Blank Questions</h2>

          <button
            onClick={addFillQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Question
          </button>
        </div>

        {quizData.test.fillQuestions.map((question, index) => (
          <div
            key={question.id}
            className="mb-6 p-4 border rounded-lg bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Question #{++index}</h3>
              <button
                onClick={() => deleteFillQuestion(question.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <input
                type="text"
                value={question.question}
                onChange={(e) =>
                  handleFillQuestionChange(
                    question.id,
                    "question",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded"
                placeholder="Enter the question text with _____ for the blank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer
              </label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) =>
                  handleFillQuestionChange(
                    question.id,
                    "correctAnswer",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded"
                placeholder="Enter the correct answer"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Multiple Choice Questions</h2>
          <button
            onClick={addTestQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Question
          </button>
        </div>

        {quizData.test.tests.map((test, index) => (
          <div key={test.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Question #{index + 1}</h3>
              <button
                onClick={() => deleteTestQuestion(test.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <input
                type="text"
                value={test.question}
                onChange={(e) =>
                  handleTestQuestionChange(test.id, e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Enter the question text"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer Options
              </label>

              {test.answerVariants.map((answer, i) => (
                <div
                  key={answer.id}
                  className="flex items-center mb-2 p-2 bg-white rounded border"
                >
                  <input
                    type="radio"
                    name={`correct-answer-${test.id}`}
                    checked={answer.isCorrect}
                    onChange={() =>
                      handleAnswerVariantChange(
                        test.id,
                        answer.id,
                        "isCorrect",
                        true
                      )
                    }
                    className="mr-2"
                  />

                  <input
                    type="text"
                    value={answer.answer}
                    onChange={(e) =>
                      handleAnswerVariantChange(
                        test.id,
                        answer.id,
                        "answer",
                        e.target.value
                      )
                    }
                    className="flex-1 p-1 border-b mr-2"
                    placeholder="Enter answer option"
                  />
                  <button
                    onClick={() => deleteAnswerVariant(test.id, answer.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                onClick={() => addAnswerVariant(test.id)}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              >
                + Add Answer Option
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center gap-3">
        <p className="text-red-500">{error}</p>
        <p className="text-green-500">{editSuccess}</p>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
