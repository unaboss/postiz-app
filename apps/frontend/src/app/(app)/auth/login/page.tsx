export const dynamic = 'force-dynamic';
import { Login } from '@gitroom/frontend/components/auth/login';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'North Tech Africa',
  description: '',
};
export default async function Auth() {
  return <Login />;
}
