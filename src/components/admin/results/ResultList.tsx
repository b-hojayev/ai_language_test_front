"use client";

import { searchResult } from "@/actions/admin/results/searchResult";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

type SubmissionData = {
  id: string;
  submitted_at: string;
  test: {
    id: string;
    name: string;
  };
  student: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

const ResultList = ({ submissions }: { submissions: SubmissionData[] }) => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState(submissions);
  console.log(query);

  useEffect(() => {
    const searchSubmissions = async () => {
      setIsLoading(true);
      setError("");

      const newSubmissions = await searchResult(query);

      if (newSubmissions.error) {
        setError(newSubmissions.error);
      } else {
        setResults(newSubmissions);
      }

      setIsLoading(false);
    };

    if (query) {
      searchSubmissions();
    }
  }, [query]);

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by student"
          value={query}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {isLoading && "Loading..."}
        <p className="text-red-500">{error}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {results.length ? (
          results.map((res) => <SubmissionCard submission={res} key={res.id} />)
        ) : (
          <p>no submissions with this query: {query}</p>
        )}
      </div>
    </div>
  );
};

export default ResultList;

function SubmissionCard({ submission }: { submission: SubmissionData }) {
  const formattedDate = new Date(submission.submitted_at).toLocaleString();

  return (
    <div className="bg-white border-2 border-transparent rounded-2xl shadow p-4 w-full max-w-sm cursor-pointer hover:border-blue-500 transition-all duration-300">
      <Link href={`/admin/results/${submission.id}`}>
        <h2 className="text-xl font-semibold mb-2">Test Submission</h2>
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Student:</span>{" "}
            {submission.student.first_name} {submission.student.last_name}
          </p>
          <p>
            <span className="font-medium">Test:</span> {submission.test.name}
          </p>
          <p>
            <span className="font-medium">Submitted At:</span> {formattedDate}
          </p>
        </div>
      </Link>
    </div>
  );
}
