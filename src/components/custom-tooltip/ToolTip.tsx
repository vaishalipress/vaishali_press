import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

export const CustomToolTip = ({
    children,
    content,
}: {
    children: React.ReactNode;
    content: string;
}) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger className="w-full">{children}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
