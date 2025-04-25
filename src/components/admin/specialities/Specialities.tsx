"use client";

import { useActionState, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { createSpeciality } from "@/actions/admin/specialities/createSpeciality";
import { deleteSpeciality } from "@/actions/admin/specialities/deleteSpeciality";
import { toast } from "sonner";
import { updateSpeciality } from "@/actions/admin/specialities/updateSpeciality";

export interface Speciality {
  faculty: {
    id: string;
    name: string;
    specialities: {
      speciality_id: string;
      speciality_name: string;
    }[];
  };
}

const initialState = {
  error: "",
};

export default function SpecialitiesPage({
  specialities,
}: {
  specialities: Speciality[];
}) {
  const [state, formAction, pending] = useActionState(
    createSpeciality,
    initialState
  );
  const [updateState, updateAction, updatePending] = useActionState(
    updateSpeciality,
    initialState
  );
  const [updateSpecName, setUpdateSpecName] = useState<string>("");

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleDelete = async (specialityId: number) => {
    setDeleteLoading(true);
    const isError = await deleteSpeciality(specialityId);
    setDeleteLoading(false);

    if (isError) {
      toast.error("Error", {
        description: isError,
        closeButton: true,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Hünarler</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Create Speciality
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Create Speciality</DialogTitle>

            <form action={formAction}>
              <Label htmlFor="faculty">Faculty</Label>
              <Select name="facultyId">
                <SelectTrigger
                  id="faculty"
                  className="w-full mt-4 cursor-pointer"
                >
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Faculties</SelectLabel>
                    {specialities.map(({ faculty }) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Label htmlFor="name" className="mt-4">
                Name
              </Label>
              <Input
                required
                id="name"
                name="name"
                placeholder="Speciality Name"
                className="mt-2"
              />
              <p className="text-red-500 mt-1">{state.error}</p>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>

                <Button type="submit" disabled={pending} variant="default">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="multiple">
        {specialities.map(({ faculty }) => (
          <AccordionItem value={faculty.id} key={faculty.id}>
            <AccordionTrigger className="cursor-pointer">
              {faculty.name}
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2">
                <CardContent>
                  {faculty.specialities.map((speciality) => (
                    <div
                      key={speciality.speciality_id}
                      className="flex justify-between items-center p-2 border-b"
                    >
                      <span>{speciality.speciality_name}</span>
                      <div className="flex gap-2">
                        <Dialog
                          onOpenChange={(open) => {
                            if (open) {
                              setUpdateSpecName(speciality.speciality_name);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogTitle>Update Speciality</DialogTitle>

                            <form action={updateAction}>
                              <Label htmlFor="faculty">Faculty</Label>
                              <Select name="facultyId" value={faculty.id}>
                                <SelectTrigger
                                  id="faculty"
                                  className="w-full mt-4 cursor-pointer"
                                >
                                  <SelectValue placeholder="Select Faculty" />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Faculties</SelectLabel>
                                    {specialities.map(({ faculty }) => (
                                      <SelectItem
                                        key={faculty.id}
                                        value={faculty.id}
                                      >
                                        {faculty.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>

                              <Label htmlFor="name" className="mt-4">
                                Name
                              </Label>
                              <Input
                                value={updateSpecName}
                                onChange={(e) =>
                                  setUpdateSpecName(e.target.value)
                                }
                                required
                                id="name"
                                name="name"
                                placeholder="Speciality Name"
                                className="mt-2"
                              />
                              <Input
                                name="specId"
                                defaultValue={speciality.speciality_id}
                                aria-hidden
                                className="mt-2 hidden"
                              />
                              <p className="text-red-500 mt-1">{state.error}</p>

                              <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                  <Button variant="secondary">Cancel</Button>
                                </DialogClose>

                                <Button
                                  type="submit"
                                  disabled={updatePending}
                                  variant="default"
                                >
                                  Update
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Button
                          disabled={deleteLoading}
                          onClick={() =>
                            handleDelete(+speciality.speciality_id)
                          }
                          variant="destructive"
                          size="icon"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
