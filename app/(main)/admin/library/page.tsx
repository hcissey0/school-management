import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Library Management</h1>
        <Button>Add New Book</Button>
      </div>
      <div className="flex space-x-4">
        <Input
          type="search"
          placeholder="Search books..."
          className="max-w-sm"
        />
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
            <SelectItem value="textbook">Textbook</SelectItem>
            <SelectItem value="reference">Reference</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Search</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ISBN</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>9781234567890</TableCell>
              <TableCell>To Kill a Mockingbird</TableCell>
              <TableCell>Harper Lee</TableCell>
              <TableCell>Fiction</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Check Out
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>9780987654321</TableCell>
              <TableCell>A Brief History of Time</TableCell>
              <TableCell>Stephen Hawking</TableCell>
              <TableCell>Non-Fiction</TableCell>
              <TableCell>Checked Out</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" disabled>
                  Check Out
                </Button>
              </TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between">
        <Button variant="outline">Export Catalog</Button>
        <Button>Manage Reservations</Button>
      </div>
    </div>
  );
}
