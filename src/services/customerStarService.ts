import { CustomerStarAccount, StarRewardHistory } from '../types';

const STORAGE_KEY = 'miss2m_customer_star_accounts';
const ACTIVE_CUSTOMER_KEY = 'miss2m_active_customer_id';

// Normalize phone/order numbers for clean keys
export function normalizeIdentifier(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // If order number format
  if (trimmed.startsWith('#') || trimmed.toUpperCase().startsWith('M2M-')) {
    return trimmed.toUpperCase();
  }
  // If phone number
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.startsWith('962')) {
    return '0' + digitsOnly.slice(3);
  }
  return digitsOnly || trimmed;
}

export function getAllCustomerAccounts(): Record<string, CustomerStarAccount> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAllCustomerAccounts(accounts: Record<string, CustomerStarAccount>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

export function getActiveCustomerId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CUSTOMER_KEY) || null;
  } catch {
    return null;
  }
}

export function setActiveCustomerId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_CUSTOMER_KEY, normalizeIdentifier(id));
  } catch {
    // ignore
  }
}

export function clearActiveCustomerId(): void {
  try {
    localStorage.removeItem(ACTIVE_CUSTOMER_KEY);
  } catch {
    // ignore
  }
}

export function getCustomerAccount(rawIdentifier: string): { account: CustomerStarAccount; isNew: boolean } {
  const id = normalizeIdentifier(rawIdentifier);
  if (!id) {
    return {
      account: {
        phone: '',
        totalStars: 0,
        unlockedVouchers: [],
        history: [],
      },
      isNew: true,
    };
  }

  const all = getAllCustomerAccounts();

  // 1. Direct match by phone or normalized key
  if (all[id]) {
    return { account: all[id], isNew: false };
  }

  // 2. Match by orderNumber in any account
  const byOrder = Object.values(all).find(
    (acc) =>
      acc.orderNumber?.toUpperCase() === id.toUpperCase() ||
      acc.history.some((h) => h.orderNumber?.toUpperCase() === id.toUpperCase())
  );
  if (byOrder) {
    return { account: byOrder, isNew: false };
  }

  // 3. New Customer: starts with 0 stars as requested
  const newAccount: CustomerStarAccount = {
    phone: id,
    totalStars: 0,
    unlockedVouchers: [],
    history: [],
    createdAt: new Date().toISOString(),
    isNewUser: true,
  };

  all[id] = newAccount;
  saveAllCustomerAccounts(all);

  return { account: newAccount, isNew: true };
}

export function awardStarsToCustomer(
  rawIdentifier: string,
  count: number,
  reasonAr: string,
  reasonEn: string,
  orderNumber?: string,
  customerName?: string
): { updatedAccount: CustomerStarAccount; milestoneUnlocked: boolean } {
  const id = normalizeIdentifier(rawIdentifier);
  const all = getAllCustomerAccounts();
  const current = all[id] || {
    phone: id,
    name: customerName,
    orderNumber: orderNumber,
    totalStars: 0,
    unlockedVouchers: [],
    history: [],
    createdAt: new Date().toISOString(),
  };

  if (customerName && !current.name) current.name = customerName;
  if (orderNumber && !current.orderNumber) current.orderNumber = orderNumber;

  const prevStars = current.totalStars;
  const newTotal = prevStars + count;
  const milestoneUnlocked = prevStars < 10 && newTotal >= 10;

  const newHistory: StarRewardHistory = {
    id: `hist-${Date.now()}`,
    reasonAr,
    reasonEn,
    stars: count,
    date: new Date().toISOString().split('T')[0],
    orderNumber,
  };

  let updatedVouchers = [...current.unlockedVouchers];
  if (milestoneUnlocked && !updatedVouchers.includes('STAR20')) {
    updatedVouchers.push('STAR20');
  }

  const updatedAccount: CustomerStarAccount = {
    ...current,
    totalStars: newTotal,
    unlockedVouchers: updatedVouchers,
    history: [newHistory, ...current.history],
    isNewUser: false,
  };

  all[id] = updatedAccount;
  saveAllCustomerAccounts(all);
  setActiveCustomerId(id);

  return { updatedAccount, milestoneUnlocked };
}
