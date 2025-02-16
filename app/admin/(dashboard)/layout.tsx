import Link from 'next/link';
import {
  BookType,
  BrickWall,
  Building,
  CircleDollarSign,
  FoldersIcon,
  HandHeart,
  HeartPulse,
  Home,
  Info,
  LanguagesIcon,
  LineChart,
  Newspaper,
  Package,
  Package2,
  PanelLeft,
  ScrollText,
  Settings,
  ShoppingCart,
  UserRoundCheck,
  Users2,
  VideoIcon
} from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/admin/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/admin/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import { VercelLogo } from '@/components/admin/icons';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';
import { ToastProvider } from '@/components/admin/ToastProvider';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

export default function DashboardLayout({
  children, session
}: {
  children: React.ReactNode, session: Session;
}) {
  return (
    <SessionProvider session={session}>
      <Providers>
        <ToastProvider>
          <main className="flex min-h-screen w-full flex-col bg-muted/40">
            <DesktopNav />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <MobileNav />
                <SearchInput />
                <User />
              </header>
              <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
                {children}
              </main>
            </div>
            <Analytics />
          </main>
        </ToastProvider>
      </Providers>
    </SessionProvider>
    
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>

        <NavItem href="/admin/language" label="Ngôn ngữ">
          <LanguagesIcon className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/setting" label="Cài đặt">
          <Settings className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/introduce" label="Giới thiệu">
          <Info className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/facilities" label="Cơ sở vật chất">
          <BrickWall className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/file-manager" label="Quản lý tập tin">
          <FoldersIcon className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/account" label="Quản lý tài khoản">
          <Users2 className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/home-content" label="Nội dung trang chủ">
          <Home className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/service" label="Quản lý dịch vụ">
          <HandHeart className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/price-sheet" label="Quản lý bảng giá">
          <CircleDollarSign className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/department" label="Quản lý khoa">
          <Building className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/doctor" label="Quản lý bác sĩ">
          <HeartPulse className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/story" label="Quản lý câu chuyện">
          <ScrollText className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/show" label="Quản lý Show">
          <VideoIcon className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/blog-type" label="Quản lý loại bài viết">
          <BookType className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/blog" label="Quản lý bài viết">
          <Newspaper className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/user-request" label="Quản lý yêu cầu">
          <UserRoundCheck className="h-5 w-5" />
        </NavItem>

      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Vercel</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
