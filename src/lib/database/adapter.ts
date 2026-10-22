/**
 * Persistent Database Adapter Interface
 * 
 * Defines the contract for persistence engines:
 * - Local / Offline / Test: SQLite adapter (backed by better-sqlite3 for local Node)
 * - Serverless Production: Managed PostgreSQL adapter (Neon / Supabase / AWS RDS over pooled HTTPS/TCP)
 */

export interface DbEnquiry {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone_number: string;
  category: string;
  capital_range: string;
  message: string | null;
  consent: number;
  status: string;
  created_at?: string;
  assigned_to?: string | null;
  assigned_to_name?: string | null;
}

export interface DatabaseAdapter {
  name: string;
  isPersistent: boolean;
  
  /**
   * Insert a new customer consultation enquiry
   */
  insertEnquiry(enquiry: Omit<DbEnquiry, "created_at">): Promise<void>;

  /**
   * Retrieve total number of enquiries for serialized reference numbering
   */
  getEnquiryCount(): Promise<number>;

  /**
   * Find recent duplicate submissions within seconds window to prevent spam
   */
  findRecentDuplicate(
    email: string,
    phone: string,
    secondsWindow: number
  ): Promise<{ id: string } | null>;

  /**
   * Fetch enquiries for staff/admin dashboard
   */
  getEnquiries(statusFilter?: string | null): Promise<DbEnquiry[]>;

  /**
   * Fetch enquiries for authenticated investor
   */
  getUserEnquiries(userId: string, email: string): Promise<DbEnquiry[]>;
}
