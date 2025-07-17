import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserType } from "@/types";
import Image from "next/image";

export const ProfileHeader = ({ user }: { user: UserType }) => {
  return (
    <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-6">
      <Image
        src={
          user.image
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
            : "/images/default-avatar.png"
        }
        alt={user.name}
        width={96}
        height={96}
        className="rounded-full border-4 border-purple-300 dark:border-purple-600"
      />
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {user.email}
        </p>
        <div className="flex gap-2 mt-2">
          <Badge className="bg-blue-100 text-blue-800">{user.user_type}</Badge>
          <Badge variant={user.status === "active" ? "default" : "destructive"}>
            {user.status}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
