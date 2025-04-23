import { getStudentBooks } from "@/actions/student/studentBook/getStudentBook";
import StudentBookList from "@/components/student/StudentBookList";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function HomePage() {
  const books = await getStudentBooks();
  console.log(books);

  if (books.error) {
    return <div>error... {books.error}</div>;
  }

  return (
    <div className="p-2">
      <nav className="flex justify-between items-center bg-[rgb(246,246,246)] p-4 rounded-lg shadow-md">
        <h1 className="text-xl font-bold">Test Hub</h1>
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </nav>

      <StudentBookList books={books} />
    </div>
  );
}
