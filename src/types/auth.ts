export type UserRole = 'user' | 'advertiser' | 'admin';
export type AccountType = 'individual' | 'company' | 'agency' | 'advertiser';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  accountType: AccountType;
  accountId: string;
  isVerified: boolean;
  walletBalanceYer: number;
  walletBalanceUsd: number;
  avatarUrl?: string;
  createdAt?: string;
}

export const DEMO_USERS: Record<string, AuthUser> = {
  individual: {
    id: 'usr-12178548',
    name: 'حمزة الشيف اليمني',
    phone: '+967 777 123 456',
    email: 'hamza@example.com',
    role: 'advertiser',
    accountType: 'individual',
    accountId: '12178548',
    isVerified: true,
    walletBalanceYer: 15000,
    walletBalanceUsd: 50,
  },
  admin: {
    id: 'admin-001',
    name: 'إدارة عون يمن (Admin)',
    phone: '+967 770 000 001',
    email: 'admin@awnyemen.com',
    role: 'admin',
    accountType: 'company',
    accountId: '99001122',
    isVerified: true,
    walletBalanceYer: 500000,
    walletBalanceUsd: 1200,
  },
};

export const DEFAULT_ADMIN_PASSWORD = 'AwnAdmin@2026!Yemen';

export const getAdminPassword = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('awn_admin_password') || DEFAULT_ADMIN_PASSWORD;
  }
  return DEFAULT_ADMIN_PASSWORD;
};

export const setAdminPassword = (newPass: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('awn_admin_password', newPass);
  }
};
