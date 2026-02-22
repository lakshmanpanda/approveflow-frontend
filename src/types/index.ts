// src/types/index.ts

export interface Department {
  id: string;
  name: string;
  region: string;
}

export interface Position {
  id: string;
  title: string;
  role_type: 'USER' | 'MANAGER' | 'HOD';
  department_id: string;
  parent_position_id: string | null;
  department?: Department;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  positions: {
    position_id: string;
    title: string;
    role_type: string;
    department: {
      id: string;
      name: string;
    };
  }[];
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  form_schema: any; // We will parse this dynamically
  is_active: boolean;
}

export interface FormSubmission {
  id: string;
  form_template_id: string;
  submitter_id: string;
  form_data: Record<string, any>;
  status: 'DRAFT' | 'PENDING' | 'REJECTED' | 'COMPLETED';
  current_stage_id: string | null;
  created_at: string;
}

export interface PendingApproval {
  approval_request_id: string;
  submission_id: string;
  form_data: Record<string, any>;
  submitter: string;
  assigned_at: string | null;
}