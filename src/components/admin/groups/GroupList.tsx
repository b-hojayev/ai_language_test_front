"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Speciality } from "../specialities/Specialities";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { createGroup } from "@/actions/admin/groups/createGroup";
import { deleteGroup } from "@/actions/admin/groups/deleteGroup";
import { toast } from "sonner";
import { updateGroup } from "@/actions/admin/groups/updateGroup";
import { useInView } from "react-intersection-observer";
import { getGroups } from "@/actions/admin/groups/getGroups";
import { useRouter } from "next/navigation";

export interface Group {
  id: string;
  faculty_id: string;
  speciality_id: string;
  group: string;
}

const FETCH_LIMIT = 25;

export default function GroupList({
  initialGroups,
  specialities,
}: {
  initialGroups: Group[];
  specialities: Speciality[];
}) {
  const router = useRouter();

  const { ref, inView } = useInView();
  const page = useRef<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentGroup, setCurrentGroup] = useState<any | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (inView && !isLastPage) {
      page.current += 1;
      fetchGroup(page.current);
    }
  }, [inView]);

  const fetchGroup = async (page: number) => {
    const response = await getGroups(page);

    if (response.error) {
      setError(response.error);
    } else {
      if (response.length < FETCH_LIMIT) {
        setIsLastPage(true);
      }

      setGroups((prev) => [...prev, ...response]);
    }
  };

  const handleDelete = async (groupId: string) => {
    const isError = await deleteGroup(groupId);

    if (isError) {
      toast.error("Error", {
        description: isError,
        closeButton: true,
      });
    } else {
      setGroups((prev) => {
        return prev.filter((value) => value.id !== groupId);
      });
    }
  };

  console.log(groups);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Groups</h1>
      <Button
        onClick={() => {
          setCurrentGroup(null);
          setDialogOpen(true);
        }}
      >
        Add Group
      </Button>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Group Number</TableHead>
            <TableHead>Faculty ID</TableHead>
            <TableHead>Speciality ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.id}</TableCell>
              <TableCell>{group.group}</TableCell>
              <TableCell>
                {
                  specialities.find(
                    ({ faculty }) => faculty.id === group.faculty_id
                  )?.faculty.name
                }
              </TableCell>
              <TableCell>
                {
                  specialities
                    .find(({ faculty }) => faculty.id === group.faculty_id)
                    ?.faculty.specialities.find(
                      (val) => val.speciality_id === group.speciality_id
                    )?.speciality_name
                }
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  onClick={() => {
                    setCurrentGroup(group);
                    setDialogOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  onClick={() => {
                    handleDelete(group.id);
                  }}
                  size="sm"
                  variant="destructive"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!isLastPage && (
        <div ref={ref} className="w-full flex items-center justify-center mt-5">
          <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isDialogOpen && (
        <GroupForm
          specialities={specialities}
          group={currentGroup}
          onClose={() => setDialogOpen(false)}
          updateGroupList={() => {
            // router.refresh();
            window.location.href = "/admin/groups";
          }}
        />
      )}
    </div>
  );
}

function GroupForm({
  group,
  onClose,
  specialities,
  updateGroupList,
}: {
  group: any;
  onClose: () => void;
  specialities: Speciality[];
  updateGroupList: () => void;
}) {
  const [form, setForm] = useState({
    group_number: "",
    faculty_id: "",
    speciality_id: "",
    study_year: "",
  });
  const [error, setError] = useState<null | string>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (group) {
      const isUpdateError = await updateGroup(group.id, form);

      if (isUpdateError) {
        setError(isUpdateError);
      } else {
        onClose();
      }
    } else {
      const isError = await createGroup(form);

      if (isError) {
        setError(isError);
      } else {
        updateGroupList();
        onClose();
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{group ? "Edit Group" : "Add Group"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Label htmlFor="faculty">Faculty</Label>
          <Select
            onValueChange={(value) => setForm({ ...form, faculty_id: value })}
            value={form.faculty_id}
            name="facultyId"
          >
            <SelectTrigger id="faculty" className="w-full cursor-pointer">
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

          <Label htmlFor="speciality">Speciality</Label>
          <Select
            value={form.speciality_id}
            onValueChange={(val) => setForm({ ...form, speciality_id: val })}
            name="specialityId"
          >
            <SelectTrigger id="speciality" className="w-full cursor-pointer">
              <SelectValue placeholder="Select Speciality" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Specialities</SelectLabel>
                {specialities
                  .find((item) => item.faculty.id === form.faculty_id)
                  ?.faculty.specialities.map((i) => (
                    <SelectItem key={i.speciality_id} value={i.speciality_id}>
                      {i.speciality_name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label htmlFor="group_number">Group Number</Label>
          <Input
            id="group_number"
            placeholder="Group Number"
            value={form.group_number}
            onChange={(e) => setForm({ ...form, group_number: e.target.value })}
          />

          <Label htmlFor="year">Year</Label>
          <Select
            name="year"
            value={form.study_year}
            onValueChange={(val) => setForm({ ...form, study_year: val })}
          >
            <SelectTrigger id="year" className="w-full cursor-pointer">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Year</SelectLabel>
                {[1, 2, 3, 4].map((value) => (
                  <SelectItem key={value} value={`${value}`}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <p className="text-red-500">{error}</p>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
