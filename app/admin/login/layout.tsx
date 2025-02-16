
import { ToastProvider } from '@/components/admin/ToastProvider';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
        {children}
    </ToastProvider>
  );
}

