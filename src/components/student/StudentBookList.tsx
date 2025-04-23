import Image from "next/image";
import Link from "next/link";

interface StudentBookProps {
  id: string;
  name: string;
  img: string;
}

const StudentBookList = ({ books }: { books: StudentBookProps[] }) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-4">
        {books.map((book) => (
          <Link
            href={`/student/book/${book.id}`}
            key={book.id}
            className="w-full min-h-[310px] flex"
          >
            <div
              key={book.id}
              className="w-full h-full flex flex-col shadow-[0_1px_98px_0_rgba(0,0,0,0.11)] rounded-[6px] overflow-hidden cursor-pointer border-2 border-transparent bg-[#f3f3f3] hover:border-[rgb(0,140,154)] transition-all duration-500"
            >
              <div className="w-full h-full relative">
                {book.img && (
                  <Image
                    alt="book_img"
                    src={`http://localhost:5000/${book.img}`}
                    width={310}
                    height={310}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex items-center justify-center w-full px-0.5 bg-white mt-[2px] min-h-[65px]">
                <p className="text-center text-[18px] font-semibold capitalize line-clamp-2">
                  {book.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentBookList;
