export const dynamic = 'force-dynamic';
import { ReactNode } from 'react';
import loadDynamic from 'next/dynamic';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
import { MantineWrapper } from '@gitroom/react/helpers/mantine.wrapper';
import { Toaster } from '@gitroom/react/toaster/toaster';
const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MantineWrapper>
      <Toaster />
      <div className="bg-[#0E0E0E] min-h-screen w-full flex items-center justify-center p-4 text-white">
        <ReturnUrlComponent />
        <div className="w-full max-w-[420px] rounded-[16px] bg-[#1A1919] p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <LogoTextComponent />
            <div className="flex">{children}</div>
          </div>
        </div>
      </div>
    </MantineWrapper>
  );
}
