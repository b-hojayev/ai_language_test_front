"use client";

import { Pencil, Plus, Trash } from "lucide-react";
import { Speciality } from "../specialities/Specialities";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Checkbox } from "../../ui/checkbox";
import { FormEvent, useState } from "react";
import { createBook } from "@/actions/admin/books/createBook";
import { deleteBook } from "@/actions/admin/books/deleteBook";
import { toast } from "sonner";
import { updateBook } from "@/actions/admin/books/updateBook";
import Image from "next/image";

export interface Book {
  id: string;
  name: string;
  faculties: { id: number; name: string }[];
  img: string;
}

export interface BookCreateValueType {
  name: string;
  facultyIds: string[];
  image: File | null;
}

const initialBookValue: BookCreateValueType = {
  name: "",
  facultyIds: [],
  image: null,
};

const BooksList = ({
  books,
  specialities,
}: {
  books: Book[];
  specialities: Speciality[];
}) => {
  const [newBookValues, setNewBookValues] = useState(initialBookValue);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const isError = await createBook(newBookValues);

    if (isError) {
      setError(isError);
    } else {
      setIsDialogOpen(false);
      setNewBookValues(initialBookValue);
    }
  };

  const handleDelete = async (bookId: string) => {
    const isError = await deleteBook(bookId);

    if (isError) {
      toast.error("Error", {
        description: isError,
        closeButton: true,
      });
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const isError = await updateBook(selectedBookId, newBookValues);

    if (isError) {
      setError(isError);
    } else {
      setUpdateModal(false);
      setNewBookValues(initialBookValue);
    }
  };

  console.log(selectedImage);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-semibold">Kitaplar</h1>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => setIsDialogOpen(open)}
        >
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Create Book
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Create Book</DialogTitle>

            <DialogDescription>
              Enter the name of the new book.
            </DialogDescription>

            <form onSubmit={handleSubmit}>
              <Label>Name</Label>
              <Input
                value={newBookValues.name}
                onChange={(e) =>
                  setNewBookValues((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="mt-2"
                required
                name="name"
                id="name"
                placeholder="Book Name"
              />

              <Label>Image</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setNewBookValues((prev) => ({
                    ...prev,
                    image: e.target.files?.[0] ?? null,
                  }))
                }
                className="mt-2"
                required
                name="name"
                id="name"
                placeholder="Book Name"
              />

              {specialities.map(({ faculty }) => (
                <div key={faculty.id} className="flex items-center gap-2 mt-3">
                  <Checkbox
                    checked={newBookValues.facultyIds.includes(faculty.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewBookValues((prev) => ({
                          ...prev,
                          facultyIds: [...prev.facultyIds, faculty.id],
                        }));
                      } else {
                        const filteredIds = newBookValues.facultyIds.filter(
                          (item) => item !== faculty.id
                        );
                        setNewBookValues((prev) => ({
                          ...prev,
                          facultyIds: filteredIds,
                        }));
                      }
                    }}
                    id={faculty.id}
                  />
                  <Label htmlFor={faculty.id}>{faculty.name}</Label>
                </div>
              ))}
              <p className="text-red-500 mt-1">{error}</p>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>

                <Button variant="default">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Ady</TableCell>
            <TableCell>Fakultetler</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {books.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {item.faculties.map((item) => item.name + ", ")}
              </TableCell>

              <TableCell>
                <Button
                  onClick={() => {
                    setImageModal(true);
                    setSelectedImage(item.img);
                  }}
                  variant="default"
                  className="mr-2"
                >
                  View Image
                </Button>

                <Button
                  variant="ghost"
                  className="mr-2"
                  onClick={() => {
                    setUpdateModal(true);
                    const facultyIds = item.faculties.map(({ id }) =>
                      id.toString()
                    );
                    setSelectedBookId(item.id);
                    setNewBookValues({
                      name: item.name,
                      facultyIds: facultyIds,
                      image: null,
                    });
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => handleDelete(item.id)}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={updateModal} onOpenChange={(open) => setUpdateModal(open)}>
        <DialogContent>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>Modify the book name.</DialogDescription>

          <form onSubmit={handleUpdate}>
            <Label htmlFor="updateName">Name</Label>
            <Input
              onChange={(e) =>
                setNewBookValues((prev) => ({ ...prev, name: e.target.value }))
              }
              value={newBookValues.name}
              id="updateName"
              placeholder="Faculty Name"
            />
            <p className="text-red-500">{error}</p>

            {specialities.map(({ faculty }) => (
              <div key={faculty.id} className="flex items-center gap-2 mt-3">
                <Checkbox
                  checked={newBookValues.facultyIds.includes(faculty.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setNewBookValues((prev) => ({
                        ...prev,
                        facultyIds: [...prev.facultyIds, faculty.id],
                      }));
                    } else {
                      const filteredIds = newBookValues.facultyIds.filter(
                        (item) => item !== faculty.id
                      );
                      setNewBookValues((prev) => ({
                        ...prev,
                        facultyIds: filteredIds,
                      }));
                    }
                  }}
                  id={faculty.id}
                />
                <Label htmlFor={faculty.id}>{faculty.name}</Label>
              </div>
            ))}

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  onClick={() => setNewBookValues(initialBookValue)}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" variant="default">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={imageModal}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
          setImageModal(open);
        }}
      >
        <DialogContent>
          <DialogTitle>Book Image</DialogTitle>

          {selectedImage && (
            <Image
              src={`http:localhost:5000/${selectedImage}`}
              alt="book_img"
              width={500}
              height={500}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksList;
