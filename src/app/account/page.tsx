import { getCustomerProfile } from '@/app/account/actions';
import { AccountClient } from './account-client';

export default async function AccountPage() {
  const { user, addresses } = await getCustomerProfile();

  return <AccountClient initialProfile={user} initialAddresses={addresses} />;
}
