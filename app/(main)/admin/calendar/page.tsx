import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">School Calendar</h1>
        <Button>Add New Event</Button>
      </div>
      <div className="flex space-x-4">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Today</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardContent className="p-6">
            <Calendar />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li>
                <div className="font-semibold">Parent-Teacher Conference</div>
                <div className="text-sm text-muted-foreground">
                  March 15, 2024 - 3:00 PM
                </div>
              </li>
              <li>
                <div className="font-semibold">Science Fair</div>
                <div className="text-sm text-muted-foreground">
                  March 18, 2024 - All Day
                </div>
              </li>
              <li>
                <div className="font-semibold">Staff Meeting</div>
                <div className="text-sm text-muted-foreground">
                  March 20, 2024 - 9:00 AM
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
