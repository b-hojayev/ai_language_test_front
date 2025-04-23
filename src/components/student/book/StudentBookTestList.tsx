import { msToMinutes } from "@/lib/utils";
import Link from "next/link";

interface BookTestList {
  id: string;
  title: string;
  timer: string;
  book: {
    id: string;
    name: string;
  };
}

const StudentBookTestList = ({ tests }: { tests: BookTestList[] }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      {tests.map((test) => (
        <Link href={`/student/test/${test.id}`} key={test.id}>
          <div className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-all hover:border-[rgb(0,140,154)] cursor-pointer duration-500">
            <h2 className="text-xl font-bold text-gray-800">{test.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Book:{" "}
              <span className="font-medium text-gray-700">
                {test.book.name}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Timer:{" "}
              <span className="font-mono text-gray-700">
                {msToMinutes(+test.timer)} min
              </span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StudentBookTestList;
