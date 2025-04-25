"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { Input } from "../../ui/input";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Speciality } from "../specialities/Specialities";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
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
import { createStudent } from "@/actions/admin/students/createStudent";
import { Group } from "../groups/GroupList";
import { deleteStudent } from "@/actions/admin/students/deleteStudents";
import { toast } from "sonner";
import { updateStudent } from "@/actions/admin/students/updateStudent";
import { getGroupsBySpeciality } from "@/actions/admin/groups/getGroupsBySpeciality";
import { useInView } from "react-intersection-observer";
import { getStudents } from "@/actions/admin/students/getStudents";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  enter_year: string;
  login: string;
  faculty: {
    id: string;
    name: string;
  };
  speciality: {
    id: string;
    name: string;
  };
  group: {
    id: string;
    number: string;
  };
}

const initialValues = {
  facultyId: "",
  specialityId: "",
  groupId: "",
  firstName: "",
  lastName: "",
  login: "",
  password: "",
};

const FETCH_LIMIT = 25;

export default function StudentList({
  initialStudents,
  specialities,
}: {
  initialStudents: Student[];
  specialities: Speciality[];
}) {
  const { ref, inView } = useInView();
  const page = useRef<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const [students, setStudents] = useState<Student[]>(initialStudents);

  const [newStudentValues, setNewStudentValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
  const [isUpdateModal, setIsUpdateModal] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupError, setGroupError] = useState("");

  useEffect(() => {
    if (inView && !isLastPage) {
      page.current += 1;
      fetchStudents(page.current);
    }
  }, [inView]);

  const fetchStudents = async (page: number) => {
    const response = await getStudents(page);

    if (response.error) {
      setError(response.error);
    } else {
      if (response.length < FETCH_LIMIT) {
        setIsLastPage(true);
      }
      setStudents((prev) => [...prev, ...response]);
    }
  };

  const handleDelete = async (studentId: string) => {
    const isError = await deleteStudent(studentId);

    if (isError) {
      toast.error("Error", {
        description: isError,
        closeButton: true,
      });
    } else {
      setStudents((prev) => {
        return prev.filter((val) => val.id !== studentId);
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const isError = await createStudent(newStudentValues);

    if (isError) {
      setError(isError);
    } else {
      window.location.href = "/admin/students";
      // setIsCreateModal(false);
      // setNewStudentValues(initialValues);
    }

    setIsLoading(false);
  };

  const handleUpdate = async (
    e: FormEvent<HTMLFormElement>,
    studentId: string
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const isError = await updateStudent(studentId, newStudentValues);

    if (isError) {
      setError(isError);
    } else {
      setIsUpdateModal(false);
      setNewStudentValues(initialValues);
      setSelectedStudentId("");
    }

    setIsLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Talyp</h1>

        <Dialog
          open={isCreateModal}
          onOpenChange={(open) => setIsCreateModal(open)}
        >
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Talyp Goş
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Create Student</DialogTitle>

            <form onSubmit={handleSubmit}>
              <Label htmlFor="firstName" className="mt-4">
                First Name
              </Label>
              <Input
                required
                id="firstName"
                name="firstName"
                placeholder="First Name"
                className="mt-2"
                value={newStudentValues.firstName}
                onChange={(e) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />

              <Label htmlFor="lastName" className="mt-4">
                Last Name
              </Label>
              <Input
                required
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                className="mt-2"
                value={newStudentValues.lastName}
                onChange={(e) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />

              <Label htmlFor="login" className="mt-4">
                Login
              </Label>
              <Input
                required
                id="login"
                name="login"
                placeholder="Login"
                className="mt-2"
                value={newStudentValues.login}
                onChange={(e) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    login: e.target.value,
                  }))
                }
              />

              <Label htmlFor="password" className="mt-4">
                Password
              </Label>
              <Input
                required
                id="password"
                name="password"
                placeholder="Password"
                className="mt-2"
                value={newStudentValues.password}
                onChange={(e) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />

              <Label htmlFor="faculty">Faculty</Label>
              <Select
                name="facultyId"
                value={newStudentValues.facultyId}
                onValueChange={(value) =>
                  setNewStudentValues((prev) => ({ ...prev, facultyId: value }))
                }
              >
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

              <Label htmlFor="speciality">Speciality</Label>
              <Select
                name="specialityId"
                value={newStudentValues.specialityId}
                onValueChange={async (value) => {
                  setNewStudentValues((prev) => ({
                    ...prev,
                    specialityId: value,
                  }));

                  const groups = await getGroupsBySpeciality(value);

                  if (!groups.error) {
                    setGroups(groups);
                  } else {
                    setGroupError(groups.error);
                  }
                }}
              >
                <SelectTrigger
                  id="speciality"
                  className="w-full mt-4 cursor-pointer"
                >
                  <SelectValue placeholder="Select Speciality" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Specialities</SelectLabel>
                    {specialities
                      .find(
                        (item1) =>
                          item1.faculty.id === newStudentValues.facultyId
                      )
                      ?.faculty.specialities.map((item2) => (
                        <SelectItem
                          key={item2.speciality_id}
                          value={item2.speciality_id}
                        >
                          {item2.speciality_name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {groupError && <div>{groupError}</div>}

              <Label htmlFor="group">Groups</Label>
              <Select
                name="groupId"
                value={newStudentValues.groupId}
                onValueChange={(value) =>
                  setNewStudentValues((prev) => ({ ...prev, groupId: value }))
                }
              >
                <SelectTrigger
                  id="group"
                  className="w-full mt-4 cursor-pointer"
                >
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Groups</SelectLabel>
                    {groups
                      .filter(
                        (item1) =>
                          item1.faculty_id === newStudentValues.facultyId
                      )
                      .filter(
                        (item2) =>
                          item2.speciality_id === newStudentValues.specialityId
                      )
                      .map((item3) => (
                        <SelectItem key={item3.id} value={item3.id}>
                          {item3.group}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <p className="text-red-500 mt-1">{error}</p>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>

                <Button type="submit" disabled={isLoading} variant="default">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-auto xl:max-w-[1000px] 2xl:max-w-[1200px]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Speciality</TableHead>
                <TableHead>Group Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.first_name}</TableCell>
                  <TableCell>{student.last_name}</TableCell>
                  <TableCell>{student.login}</TableCell>
                  <TableCell>{student.faculty.name}</TableCell>
                  <TableCell>{student.speciality.name}</TableCell>
                  <TableCell>{student.group.number}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      onClick={async () => {
                        setIsUpdateModal(true);
                        setSelectedStudentId(student.id);
                        setNewStudentValues({
                          facultyId: student.faculty.id,
                          firstName: student.first_name,
                          groupId: student.group.id,
                          lastName: student.last_name,
                          login: student.login,
                          password: "",
                          specialityId: student.speciality.id,
                        });
                        const groups = await getGroupsBySpeciality(
                          student.speciality.id
                        );

                        if (!groups.error) {
                          setGroups(groups);
                        } else {
                          setGroupError(groups.error);
                        }
                      }}
                      variant="outline"
                      size="icon"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => handleDelete(student.id)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLastPage && (
            <div
              ref={ref}
              className="w-full flex items-center justify-center mt-5"
            >
              <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>

      {isUpdateModal && (
        <Dialog
          open={isUpdateModal}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedStudentId("");
              setNewStudentValues(initialValues);
            }
            setIsUpdateModal(open);
          }}
        >
          <DialogContent>
            <DialogTitle>Update Student</DialogTitle>

            <form onSubmit={(e) => handleUpdate(e, selectedStudentId)}>
              <Label htmlFor="firstName" className="mt-4">
                First Name
              </Label>
              <Input
                required
                id="firstName"
                name="firstName"
                placeholder="First Name"
                className="mt-2"
                value={newStudentValues.firstName}
                onChange={(e) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />

              <Label htmlFor="lastName" className="mt-4">
                Last Name
              </Label>
              <Input
                required
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                className="mt-2"
                value={newStudentValues.lastName}
                onChange={(e) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />

              <Label htmlFor="login" className="mt-4">
                Login
              </Label>
              <Input
                required
                id="login"
                name="login"
                placeholder="Login"
                className="mt-2"
                value={newStudentValues.login}
                onChange={(e) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    login: e.target.value,
                  }))
                }
              />

              <Label htmlFor="password" className="mt-4">
                Password
              </Label>
              <Input
                required
                id="password"
                name="password"
                placeholder="Password"
                className="mt-2"
                value={newStudentValues.password}
                onChange={(e) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />

              <Label htmlFor="faculty">Faculty</Label>
              <Select
                name="facultyId"
                value={newStudentValues.facultyId}
                onValueChange={(value) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    facultyId: value,
                  }))
                }
              >
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

              <Label htmlFor="speciality">Speciality</Label>
              <Select
                name="specialityId"
                value={newStudentValues.specialityId}
                onValueChange={async (value) => {
                  setNewStudentValues((prev) => ({
                    ...prev,
                    specialityId: value,
                  }));

                  const groups = await getGroupsBySpeciality(value);

                  if (!groups.error) {
                    setGroups(groups);
                  } else {
                    setGroupError(groups.error);
                  }
                }}
              >
                <SelectTrigger
                  id="speciality"
                  className="w-full mt-4 cursor-pointer"
                >
                  <SelectValue placeholder="Select Speciality" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Specialities</SelectLabel>
                    {specialities
                      .find(
                        (item1) =>
                          item1.faculty.id === newStudentValues.facultyId
                      )
                      ?.faculty.specialities.map((item2) => (
                        <SelectItem
                          key={item2.speciality_id}
                          value={item2.speciality_id}
                        >
                          {item2.speciality_name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Label htmlFor="group">Groups</Label>
              <Select
                name="groupId"
                value={newStudentValues.groupId}
                onValueChange={(value) =>
                  setNewStudentValues((prev) => ({
                    ...prev,
                    groupId: value,
                  }))
                }
              >
                <SelectTrigger
                  id="group"
                  className="w-full mt-4 cursor-pointer"
                >
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Groups</SelectLabel>
                    {groups
                      .filter(
                        (item1) =>
                          item1.faculty_id === newStudentValues.facultyId
                      )
                      .filter(
                        (item2) =>
                          item2.speciality_id === newStudentValues.specialityId
                      )
                      .map((item3) => (
                        <SelectItem key={item3.id} value={item3.id}>
                          {item3.group}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <p className="text-red-500 mt-1">{error}</p>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>

                <Button type="submit" disabled={isLoading} variant="default">
                  Update
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
