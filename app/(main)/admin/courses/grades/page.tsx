import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function CourseGradesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Course Grades</h1>
      <div className="flex space-x-4">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="math101">MATH101: Intro to Algebra</SelectItem>
            <SelectItem value="sci201">SCI201: Biology Fundamentals</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fall2023">Fall 2023</SelectItem>
            <SelectItem value="spring2024">Spring 2024</SelectItem>
          </SelectContent>
        </Select>
        <Button>View Grades</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.7%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Achieved by 2 students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground">
              1 student below passing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Normal</div>
            <p className="text-xs text-muted-foreground">
              Most grades between 80-89%
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Midterm Grade</TableHead>
              <TableHead>Final Grade</TableHead>
              <TableHead>Overall Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>S001</TableCell>
              <TableCell>Alice Johnson</TableCell>
              <TableCell>88%</TableCell>
              <TableCell>92%</TableCell>
              <TableCell>90%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>S002</TableCell>
              <TableCell>Bob Smith</TableCell>
              <TableCell>76%</TableCell>
              <TableCell>82%</TableCell>
              <TableCell>79%</TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </div>
      <Button>Export Grades</Button>
    </div>
  );
}
