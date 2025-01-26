import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TeacherDirectoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Directory</h1>
        <Button>Add New Teacher</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="Search teachers..."
          className="max-w-sm"
        />
        <Button variant="outline">Search</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>T001</TableCell>
              <TableCell>Jane Doe</TableCell>
              <TableCell>Mathematics</TableCell>
              <TableCell>jane.doe@school.edu</TableCell>
              <TableCell>(555) 123-4567</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
