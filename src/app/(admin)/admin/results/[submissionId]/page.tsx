import { getSingleResult } from "@/actions/admin/results/getSingleResult";
import SubmissionResult from "@/components/admin/results/SubmissionResult";

const SubmissionPage = async ({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) => {
  const { submissionId } = await params;
  const submission = await getSingleResult(submissionId);
  console.log(submission);

  return <SubmissionResult result={submission} />;
};

export default SubmissionPage;
