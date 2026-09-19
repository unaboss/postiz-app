import { LifetimeDeal } from '@gitroom/frontend/components/billing/lifetime.deal';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: `North Tech Africa Lifetime deal`,
  description: '',
};
export default async function Page() {
  return <LifetimeDeal />;
}
