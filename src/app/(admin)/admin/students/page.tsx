import { getSpecialities } from "@/actions/admin/specialities/getSpecialities";
import { getStudents } from "@/actions/admin/students/getStudents";
import StudentList from "@/components/admin/students/StudentList";
import { AlertCircle } from "lucide-react";

const AdminStudentsPage = async () => {
  const students = await getStudents(1);
  const specialities = await getSpecialities();

  if (students.error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {students.error}
      </div>
    );
  }

  return <StudentList initialStudents={students} specialities={specialities} />;
};

export default AdminStudentsPage;
