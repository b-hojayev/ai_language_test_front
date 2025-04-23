import { getAllResults } from "@/actions/admin/results/getAllResults";
import ResultList from "@/components/admin/results/ResultList";

const ResultsPage = async () => {
  const results = await getAllResults();
  console.log(results);

  return <ResultList submissions={results} />;
};

export default ResultsPage;
