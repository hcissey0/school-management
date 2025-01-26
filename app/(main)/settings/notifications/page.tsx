import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notification Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure which email notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="attendance-alerts">Attendance Alerts</Label>
            <Switch id="attendance-alerts" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="grade-updates">Grade Updates</Label>
            <Switch id="grade-updates" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="behavior-reports">Behavior Reports</Label>
            <Switch id="behavior-reports" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="school-announcements">School Announcements</Label>
            <Switch id="school-announcements" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>
            Configure which SMS notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
            <Switch id="emergency-alerts" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="absence-notifications">Absence Notifications</Label>
            <Switch id="absence-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="event-reminders">Event Reminders</Label>
            <Switch id="event-reminders" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Configure which in-app notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="assignment-due">Assignment Due Dates</Label>
            <Switch id="assignment-due" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="new-messages">New Messages</Label>
            <Switch id="new-messages" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="system-updates">System Updates</Label>
            <Switch id="system-updates" />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}
