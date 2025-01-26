import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Attendance</h1>
      <div className="flex flex-col lg:flex-row justify-center space-x-4">
        <div className="">
          <Calendar />
        </div>
        <div className="flex-grow rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>001</TableCell>
                <TableCell>John Smith</TableCell>
                <TableCell>Present</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Mark Absent
                  </Button>
                </TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </div>
      </div>
      <Button>Save Attendance</Button>
    </div>
  );
}
