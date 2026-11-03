'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ProfileData {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

export interface AddressData {
  id?: string;
  fullName: string;
  mobile: string;
  email?: string;
  houseNumber: string;
  street: string;
  area?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType?: 'home' | 'office' | 'other';
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export async function getCustomerProfile(): Promise<{
  user: ProfileData | null;
  addresses: AddressData[];
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, addresses: [] };
  }

  // Fetch from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch addresses
  const { data: addresses } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default_shipping', { ascending: false });

  return {
    user: {
      id: user.id,
      email: user.email || '',
      firstName: profile?.first_name || user.user_metadata?.first_name || '',
      lastName: profile?.last_name || user.user_metadata?.last_name || '',
      phone: profile?.phone || user.user_metadata?.phone || '',
    },
    addresses: (addresses || []).map((a: any) => ({
      id: a.id,
      fullName: a.full_name,
      mobile: a.mobile,
      email: a.email,
      houseNumber: a.house_number,
      street: a.street,
      area: a.area,
      landmark: a.landmark,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      addressType: a.address_type,
      isDefaultShipping: a.is_default_shipping,
      isDefaultBilling: a.is_default_billing,
    })),
  };
}

export async function updateCustomerProfile(data: {
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: No active session' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/account');
  return { success: true };
}

export async function saveCustomerAddress(
  address: AddressData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: No active session' };
  }

  if (address.id) {
    // Update existing
    const { error } = await supabase
      .from('user_addresses')
      .update({
        full_name: address.fullName,
        mobile: address.mobile,
        email: address.email,
        house_number: address.houseNumber,
        street: address.street,
        area: address.area,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        address_type: address.addressType || 'home',
        is_default_shipping: address.isDefaultShipping ?? false,
        is_default_billing: address.isDefaultBilling ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', address.id)
      .eq('user_id', user.id);

    if (error) return { success: false, error: error.message };
  } else {
    // Insert new
    const { error } = await supabase.from('user_addresses').insert({
      user_id: user.id,
      full_name: address.fullName,
      mobile: address.mobile,
      email: address.email,
      house_number: address.houseNumber,
      street: address.street,
      area: address.area,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      address_type: address.addressType || 'home',
      is_default_shipping: address.isDefaultShipping ?? false,
      is_default_billing: address.isDefaultBilling ?? false,
    });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/account');
  return { success: true };
}

export async function deleteCustomerAddress(
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/account');
  return { success: true };
}
