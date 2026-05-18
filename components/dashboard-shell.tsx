import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { NotificationsPopover } from "@/components/notifications-popover";
import { UserMenu } from "@/components/user-menu";
import type { SessionUser } from "@/lib/auth-types";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
}

export function DashboardShell({
  user,
  notifications = [],
  children,
}: {
  user: SessionUser;
  notifications?: Notification[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <MobileNav role={user.role} />
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <NotificationsPopover notifications={notifications} />
            <UserMenu user={user} />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
