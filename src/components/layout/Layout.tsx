import type { ReactNode } from "react";

interface LayoutProps {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function Layout({ header, children, footer }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {header}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
        {children}
      </main>
      {footer && (
        <div className="mx-auto w-full max-w-7xl px-6 pb-6">{footer}</div>
      )}
    </div>
  );
}
