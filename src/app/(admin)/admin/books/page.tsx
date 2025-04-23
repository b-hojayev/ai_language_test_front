import { getBooks } from "@/actions/admin/books/getBooks";
import { getSpecialities } from "@/actions/admin/specialities/getSpecialities";
import BooksList from "@/components/admin/books/BooksList";

const BookPage = async () => {
  const specialities = await getSpecialities();
  const books = await getBooks();

  console.log("books:", books);

  return <BooksList books={books} specialities={specialities} />;
};

export default BookPage;
