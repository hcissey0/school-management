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

export default function TeacherSchedulesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Teacher Schedules</h1>
      <div className="flex space-x-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Teacher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jane-doe">Jane Doe</SelectItem>
            <SelectItem value="john-smith">John Smith</SelectItem>
          </SelectContent>
        </Select>
        <Button>View Schedule</Button>
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
              <TableCell>8:00 AM - 9:00 AM</TableCell>
              <TableCell>Math 101</TableCell>
              <TableCell>-</TableCell>
              <TableCell>Math 101</TableCell>
              <TableCell>-</TableCell>
              <TableCell>Math 101</TableCell>
            </TableRow>
            {/* Add more rows for different time slots */}
          </TableBody>
        </Table>
      </div>
      <Button>Print Schedule</Button>
    </div>
  );
}
