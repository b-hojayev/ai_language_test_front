import { getSpecialities } from "@/actions/admin/specialities/getSpecialities";
import Specialities from "@/components/admin/specialities/Specialities";
import { AlertCircle } from "lucide-react";

const AdminSpecialityPage = async () => {
  const specialities = await getSpecialities();

  if (specialities.error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {specialities.error}
      </div>
    );
  }

  return <Specialities specialities={specialities} />;
};

export default AdminSpecialityPage;
