import { getStudentTest } from "@/actions/student/studentTest/getStudentTest";
import StudentTest from "@/components/student/StudentTest";

const StudentTestPage = async ({
  params,
}: {
  params: Promise<{ testId: string }>;
}) => {
  const { testId } = await params;
  const testQuestions = await getStudentTest(testId);
  console.log(testQuestions);

  if (testQuestions.error) {
    return <p className="text-red-500">{testQuestions.error}</p>;
  }

  return (
    <StudentTest
      questions={testQuestions.questions}
      timer={testQuestions.timer}
    />
  );
};

export default StudentTestPage;
