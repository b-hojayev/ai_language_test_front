"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { deleteFaculy } from "@/actions/admin/faculties/deleteFaculty";
import { useActionState, useState } from "react";
import { createFaculty } from "@/actions/admin/faculties/createFaculty";
import { toast } from "sonner";
import { editFaculty } from "@/actions/admin/faculties/editFaculty";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Faculty {
  id: number;
  name: string;
}

const initialState = {
  error: "",
};

const FacultiesTable = ({ faculties }: { faculties: Faculty[] }) => {
  const [state, formAction, pending] = useActionState(
    createFaculty,
    initialState
  );
  const [editFacultyName, setEditFacultyName] = useState<null | {
    name: string;
  }>(null);
  const [editError, setEditError] = useState<null | string>(null);

  const handleDelete = async (id: number) => {
    const isDeleted = await deleteFaculy(id);

    if (isDeleted.error) {
      toast.error("Error", {
        description: isDeleted.error,
        closeButton: true,
      });
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editFacultyName?.name) return;

    const updateError = await editFaculty({ id, name: editFacultyName.name });

    if (updateError) {
      setEditError(updateError);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-semibold">Fakultetler</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={pending} variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Create Faculty
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Create Faculty</DialogTitle>

            <DialogDescription>
              Enter the name of the new faculty.
            </DialogDescription>

            <Label>Name</Label>
            <form action={formAction}>
              <Input required name="name" placeholder="Faculty Name" />
              <p className="text-red-500 mt-1">{state.error}</p>

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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {faculties.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>

              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="mr-2"
                      onClick={() => {
                        setEditFacultyName({ name: item.name });
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Edit Faculty</DialogTitle>
                    <DialogDescription>
                      Modify the faculty name.
                    </DialogDescription>
                    <Label>Name</Label>
                    <Input
                      value={editFacultyName?.name || ""}
                      onChange={(e) =>
                        setEditFacultyName((prev) => {
                          if (prev) {
                            return { ...prev, name: e.target.value };
                          } else {
                            return null;
                          }
                        })
                      }
                      placeholder="Faculty Name"
                    />
                    <p className="text-red-500">{editError}</p>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="secondary"
                          onClick={() => setEditFacultyName(null)}
                        >
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button
                        onClick={() => handleUpdate(item.id)}
                        variant="default"
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="cursor-pointer">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete &quot;{item.name}&quot;?
                      This action cannot be undone.
                    </DialogDescription>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary" className="cursor-pointer">
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FacultiesTable;
