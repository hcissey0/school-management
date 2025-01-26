import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">General Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>
            Update your school's basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school-name">School Name</Label>
            <Input id="school-name" placeholder="Enter school name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-address">School Address</Label>
            <Textarea id="school-address" placeholder="Enter school address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-phone">Phone Number</Label>
            <Input id="school-phone" placeholder="Enter phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-email">Email Address</Label>
            <Input
              id="school-email"
              type="email"
              placeholder="Enter email address"
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Academic Year Settings</CardTitle>
          <CardDescription>
            Configure your academic year and semester dates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="academic-year">Current Academic Year</Label>
            <Select>
              <SelectTrigger id="academic-year">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fall-start">Fall Semester Start</Label>
              <Input id="fall-start" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fall-end">Fall Semester End</Label>
              <Input id="fall-end" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spring-start">Spring Semester Start</Label>
              <Input id="spring-start" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spring-end">Spring Semester End</Label>
              <Input id="spring-end" type="date" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
