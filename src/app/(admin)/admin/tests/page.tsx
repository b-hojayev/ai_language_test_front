import { getBooks } from "@/actions/admin/books/getBooks";
import { getTests } from "@/actions/admin/tests/getTests";
import TestList from "@/components/admin/tests/TestList";
import { AlertCircle } from "lucide-react";

const AdminTestPage = async () => {
  const tests = await getTests();
  const books = await getBooks();

  console.log(tests);

  if (tests.error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {tests.error}
      </div>
    );
  }

  return <TestList tests={tests} books={books} />;
};

export default AdminTestPage;
