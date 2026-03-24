export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  userRole: string;
  roles: string[];
  agentId?: string;
  rfidTag?: string;
  employeeId?: string;
  phoneNumber?: string;
}
