import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReactNode } from "react";

const BookLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-2">
      <nav className="flex justify-between items-center bg-[rgb(246,246,246)] p-4 rounded-lg shadow-md">
        <h1 className="text-xl font-bold">Test Hub</h1>
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </nav>

      {children}
    </div>
  );
};

export default BookLayout;
