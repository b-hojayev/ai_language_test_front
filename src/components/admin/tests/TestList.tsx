"use client";

import { Pencil, Plus, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { FormEvent, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { sendTestPrompt } from "@/actions/admin/tests/sendTestPrompt";
import QuizEditor from "./QuizEditor";
import { Book } from "../books/BooksList";
import Link from "next/link";
import { msToTime } from "@/lib/utils";
import { deleteTest } from "@/actions/admin/tests/deleteTest";
import { toast } from "sonner";

interface Test {
  id: string;
  title: string;
  isVisible: boolean;
  timer: string;
  book: {
    id: string;
    name: string;
  };
}

export interface NewTestPromptValue {
  prompt: string;
  testQuestionCount: string;
  fillQuestionCount: string;
}

interface PreviewType {
  fillQuestions: {
    id: number;
    question: string;
    correctAnswer: string;
  }[];
  tests: {
    id: number;
    question: string;
    answerVariants: {
      id: number;
      answer: string;
      isCorrect: boolean;
    }[];
  }[];
}

// const previewEx = {
//   fillQuestions: [
//     {
//       id: 1,
//       question:
//         "In the story, the main character _____ at the beginning of the journey.",
//       correctAnswer: "starts",
//     },
//   ],
//   tests: [
//     {
//       id: 1,
//       question:
//         "What is the correct form of the verb to use after 'have'? 'Have______ and not have?'",
//       answerVariants: [
//         {
//           id: 1,
//           answer: "some",
//           isCorrect: true,
//         },
//         {
//           id: 2,
//           answer: "any",
//           isCorrect: false,
//         },
//         {
//           id: 3,
//           answer: "none",
//           isCorrect: false,
//         },
//         {
//           id: 4,
//           answer: "all",
//           isCorrect: false,
//         },
//       ],
//     },
//   ],
// };

const initialPrompt = {
  prompt: "",
  testQuestionCount: "",
  fillQuestionCount: "",
};

const TestList = ({ tests, books }: { tests: Test[]; books: Book[] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [promptValues, setPromptValues] = useState(initialPrompt);
  const [error, setError] = useState("");

  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<null | PreviewType>(null);

  const reset = () => {
    setPromptValues(initialPrompt);
    setIsDialogOpen(false);
    setPreviewData(null);
  };

  console.log(promptValues);

  const handlePromptSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPreviewLoading(true);

    const promptData = await sendTestPrompt(promptValues);

    if (promptData.error) {
      setError(promptData.error);
    } else {
      setPreviewData(promptData);
    }

    setIsPreviewLoading(false);
  };

  const handleDelete = async (testId: string) => {
    const isError = await deleteTest(testId);

    if (isError) {
      toast.error("Error", {
        description: isError,
        closeButton: true,
      });
    }
  };

  return (
    <>
      {previewData ? (
        <QuizEditor
          isFromEdit={false}
          onClose={reset}
          initialData={{
            bookId: "",
            isVisible: true,
            timer: "",
            title: "",
            test: previewData,
          }}
          books={books}
        />
      ) : (
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold">Testler</h1>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => setIsDialogOpen(open)}
            >
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Plus className="w-4 h-4 mr-2" /> Create Test
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogTitle>Create Test</DialogTitle>

                <form onSubmit={handlePromptSubmit}>
                  <Label>Prompt</Label>
                  <Input
                    value={promptValues.prompt}
                    onChange={(e) =>
                      setPromptValues((prev) => ({
                        ...prev,
                        prompt: e.target.value,
                      }))
                    }
                    className="mt-2"
                    required
                    name="name"
                    id="name"
                    placeholder="Book Name"
                  />

                  <Label>Test Sorag Sany</Label>
                  <Input
                    value={promptValues.testQuestionCount}
                    onChange={(e) =>
                      setPromptValues((prev) => ({
                        ...prev,
                        testQuestionCount: e.target.value,
                      }))
                    }
                    className="mt-2"
                    required
                    name="testQuestionCount"
                    id="testQuestionCount"
                    type="number"
                    placeholder="Test Count"
                  />

                  <Label>Doldur Sorag Sany</Label>
                  <Input
                    value={promptValues.fillQuestionCount}
                    onChange={(e) =>
                      setPromptValues((prev) => ({
                        ...prev,
                        fillQuestionCount: e.target.value,
                      }))
                    }
                    className="mt-2"
                    required
                    name="fillQuestionCount"
                    id="fillQuestionCount"
                    type="number"
                    placeholder="Test Count"
                  />

                  <p className="text-red-500 mt-1">{error}</p>

                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button onClick={reset} variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button disabled={isPreviewLoading} variant="default">
                      {isPreviewLoading ? "Loading..." : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {previewData !== null}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ady</TableCell>
                <TableCell>Aktiv</TableCell>
                <TableCell>Wagty</TableCell>
                <TableCell>Kitap</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tests.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {item.isVisible ? (
                      <div className="rounded-full w-4 h-4 bg-green-500"></div>
                    ) : (
                      <div className="rounded-full w-4 h-4 bg-red-500"></div>
                    )}
                  </TableCell>
                  <TableCell>{msToTime(+item.timer)}</TableCell>
                  <TableCell>{item.book.name}</TableCell>

                  <TableCell>
                    <Link href={`/admin/tests/${item.id}`}>
                      <Button variant="ghost" className="mr-2">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default TestList;
