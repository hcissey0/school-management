import { SidebarLayout } from "@/components/layout/sidebar-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

        <SidebarLayout>{children}</SidebarLayout>

  );
}
