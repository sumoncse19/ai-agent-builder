import type { ReactNode } from "react";

interface LayoutProps {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function Layout({ header, children, footer }: LayoutProps) {
  return (
    <div className="noise-bg relative flex min-h-screen flex-col bg-forge-950">
      <div className="relative z-10 flex min-h-screen flex-col">
        {header}
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
          {children}
        </main>
        {footer && (
          <div className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
