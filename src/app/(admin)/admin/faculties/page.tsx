import { getFaculties } from "@/actions/admin/faculties/getFaculties";
import FacultiesTable from "@/components/admin/faculties/FacultiesTable";
import { AlertCircle } from "lucide-react";

const FacultiesPage = async () => {
  const faculties = await getFaculties();

  if (faculties.error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {faculties.error}
      </div>
    );
  }

  return <FacultiesTable faculties={faculties} />;
};

export default FacultiesPage;
