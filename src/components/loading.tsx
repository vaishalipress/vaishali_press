import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export const LoadingCells = ({ n = 10, m = 5 }: { n?: number; m?: number }) => {
    return Array(n)
        .fill("")
        .map((v, idx) => (
            <TableRow key={idx}>
                {Array(m)
                    .fill("")
                    .map((x, i) => (
                        <TableCell key={i} className="py-6">
                            <Skeleton className="h-5 w-full" />
                        </TableCell>
                    ))}
            </TableRow>
        ));
};
