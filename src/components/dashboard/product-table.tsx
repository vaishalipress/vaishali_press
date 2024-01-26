import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export const Product = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px] uppercase">name</TableHead>
                    <TableHead className="uppercase">Sale</TableHead>
                    <TableHead className="uppercase">qty</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium capitalize">
                        Apple
                    </TableCell>
                    <TableCell className="capitalize">5000</TableCell>
                    <TableCell className="capitalize">2</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium capitalize">
                        banana
                    </TableCell>
                    <TableCell className="capitalize">5000</TableCell>
                    <TableCell className="capitalize">2</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};
