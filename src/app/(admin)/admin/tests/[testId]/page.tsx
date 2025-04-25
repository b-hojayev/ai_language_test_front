import { getBooks } from "@/actions/admin/books/getBooks";
import { getSingleTest } from "@/actions/admin/tests/getSingleTest";
import QuizEditor from "@/components/admin/tests/QuizEditor";
import { msToMinutes } from "@/lib/utils";

const TestEditPage = async ({
  params,
}: {
  params: Promise<{ testId: string }>;
}) => {
  const { testId } = await params;
  const books = await getBooks();
  const test = await getSingleTest(testId);
  console.log(test);

  return (
    <QuizEditor
      books={books}
      initialData={{ ...test, timer: msToMinutes(test.timer) }}
      isFromEdit={true}
      testId={testId}
    />
  );
};

export default TestEditPage;
