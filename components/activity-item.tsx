import { AuditLog } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { generateLogMessage } from "@/lib/generate-log-message";
import { format } from "date-fns";

type ActivityItemProps = {
  log: AuditLog;
};
export const ActivityItem = ({ log }: ActivityItemProps) => {
  return (
    <li className="flex items-start gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={log.userImage} />
      </Avatar>
      <div className="flex flex-col gap-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-700">
            {log.userName}
          </span>{" "}
          {generateLogMessage(log)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};
