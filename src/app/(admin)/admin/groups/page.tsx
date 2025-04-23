import { getGroups } from "@/actions/admin/groups/getGroups";
import { getSpecialities } from "@/actions/admin/specialities/getSpecialities";
import GroupList from "@/components/admin/groups/GroupList";
import { AlertCircle } from "lucide-react";

const GroupPage = async () => {
  const specialities = await getSpecialities();
  const groups = await getGroups();

  console.log("specs:", specialities);
  console.log("groups:", groups);

  if (specialities.error || groups.error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {specialities?.error}
        {groups?.error}
      </div>
    );
  }

  return <GroupList groups={groups} specialities={specialities} />;
};

export default GroupPage;
