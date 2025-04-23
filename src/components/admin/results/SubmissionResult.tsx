"use client";

type Answer = {
  questionId: string;
  question: string;
  questionType: string;
  selectedAnswerId: string | null;
  selectedAnswerText: string | null;
  studentAnswer: string | null;
  isCorrect: boolean;
  correctAnswer: string;
};

type Submission = {
  id: string;
  submittedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  test: {
    id: string;
    title: string;
    timer: string;
  };
  answers: Answer[];
};

type Props = {
  submission: Submission;
};

export default function SubmissionResult({ result }: { result: Props }) {
  const { student, answers, submittedAt, test } = result.submission;

  const formatTimer = (ms: string) => {
    const total = parseInt(ms);
    const minutes = Math.floor(total / 60000);
    return `${minutes} minutes`;
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString();
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test Submission</h1>

      <section className="bg-white shadow rounded p-4 mb-6">
        <p>
          <span className="font-semibold">Student:</span> {student.firstName}{" "}
          {student.lastName}
        </p>
        <p>
          <span className="font-semibold">Test:</span> {test.title}
        </p>
        <p>
          <span className="font-semibold">Submitted at:</span>{" "}
          {formatDate(submittedAt)}
        </p>
        <p>
          <span className="font-semibold">Timer:</span>{" "}
          {formatTimer(test.timer)}
        </p>
      </section>

      <h2 className="text-xl font-semibold mb-3">Answers</h2>
      <div className="space-y-4">
        {answers.map((answer, idx) => (
          <div
            key={answer.questionId}
            className={`p-4 rounded border ${
              answer.isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <p className="font-semibold mb-1">
              Q{idx + 1}: {answer.question}
            </p>
            <p>
              <span className="font-medium">Your Answer:</span>{" "}
              {answer.studentAnswer ?? answer.selectedAnswerText ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Correct Answer:</span>{" "}
              {answer.correctAnswer}
            </p>
            <p
              className={`font-medium ${
                answer.isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {answer.isCorrect ? "Correct" : "Incorrect"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
