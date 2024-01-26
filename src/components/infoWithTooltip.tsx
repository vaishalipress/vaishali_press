import { LucideIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { ActionTooltip } from "./action-tooltip";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface infoProps extends HTMLAttributes<HTMLDivElement> {
    toolTip: string;
    Icon: LucideIcon;
    count: string | number;
}
export const Info: FC<infoProps> = ({ className, toolTip, Icon, count }) => {
    return (
        <ActionTooltip label={toolTip}>
            <Badge
                variant={"secondary"}
                className={cn(
                    "h-8 flex items-center justify-between gap-1",
                    className
                )}
            >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="lg:ml-3 text-xs lg:text-base dark:text-zinc-300">
                    {count}
                </span>
            </Badge>
        </ActionTooltip>
    );
};
