import { getStudentBookTest } from "@/actions/student/studentBook/getStudentBookTest";
import StudentBookTestList from "@/components/student/book/StudentBookTestList";

const BookTestsPage = async ({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) => {
  const { bookId } = await params;
  const tests = await getStudentBookTest(bookId);
  console.log(tests);

  if (tests.error) {
    return <p className="text-red-500">{tests.error}</p>;
  }

  return <StudentBookTestList tests={tests} />;
};

export default BookTestsPage;
