import { Button } from "@/components/ui/button";
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

export default function CourseSchedulesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Course Schedules</h1>
      <div className="flex space-x-4">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fall2023">Fall 2023</SelectItem>
            <SelectItem value="spring2024">Spring 2024</SelectItem>
          </SelectContent>
        </Select>
        <Button>Generate Schedule</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Monday</TableHead>
              <TableHead>Tuesday</TableHead>
              <TableHead>Wednesday</TableHead>
              <TableHead>Thursday</TableHead>
              <TableHead>Friday</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>8:00 AM - 9:30 AM</TableCell>
              <TableCell>MATH101</TableCell>
              <TableCell>-</TableCell>
              <TableCell>MATH101</TableCell>
              <TableCell>-</TableCell>
              <TableCell>MATH101</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>9:45 AM - 11:15 AM</TableCell>
              <TableCell>-</TableCell>
              <TableCell>SCI201</TableCell>
              <TableCell>-</TableCell>
              <TableCell>SCI201</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            {/* Add more rows for different time slots */}
          </TableBody>
        </Table>
      </div>
      <Button>Print Schedule</Button>
    </div>
  );
}
