import { ChartComponent } from "@/components/charts/chart";
import { StudentPieComponent } from "@/components/charts/student-pie";
import { Input } from "@/components/ui/input";

export default function TestPage() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-2 ">
          <div>

        <ChartComponent />
          </div>
          <div>

        <StudentPieComponent />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-card p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold">Total Students</h3>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-sm text-muted-foreground">
              +5.2% from last month
            </p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold">Total Teachers</h3>
            <div className="text-3xl font-bold">98</div>
            <p className="text-sm text-muted-foreground">
              +2.1% from last month
            </p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold">Average Attendance</h3>
            <div className="text-3xl font-bold">92.7%</div>
            <p className="text-sm text-muted-foreground">
              -0.5% from last week
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-card p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold">Upcoming Events</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Parent-Teacher Conference</span>
                <span className="text-sm text-muted-foreground">Mar 15</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Science Fair</span>
                <span className="text-sm text-muted-foreground">Apr 2</span>
              </li>
              <li className="flex items-center justify-between">
                <span>End of Term Exams</span>
                <span className="text-sm text-muted-foreground">May 10-20</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl bg-card p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold">Recent Announcements</h3>
            <ul className="space-y-2">
              <li>New COVID-19 guidelines for campus</li>
              <li>Library extended hours for exam week</li>
              <li>Online portal maintenance scheduled</li>
            </ul>
          </div>
        </div>
        <div className="rounded-xl bg-card p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Add New Student
            </button>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Create Announcement
            </button>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
