import { LucideIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { ActionTooltip } from "./action-tooltip";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface infoProps extends HTMLAttributes<HTMLDivElement> {
    toolTip: string;
    Icon: LucideIcon;
    count: string | number;
}
export const Info: FC<infoProps> = ({
    className,
    toolTip,
    Icon,
    count,
    ...props
}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>
                    <Badge
                        variant={"secondary"}
                        className={cn(
                            "h-8 flex items-center justify-between gap-1",
                            className
                        )}
                        {...props}
                    >
                        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="lg:ml-3 text-xs lg:text-base dark:text-zinc-300">
                            {count}
                        </span>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent side={"top"} align={"center"}>
                    <p className="font-semibold text-sm capitalize">
                        {toolTip.toLowerCase()}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
