import { UserDetailsResponse } from '@/api'

export function getStaffDefaultValues(staff: UserDetailsResponse | null) {
  return {
    firstName: staff?.firstName,
    lastName: staff?.lastName,
    email: staff?.email,
    role: staff?.role,
    isEmailVerified: staff?.isEmailVerified,
  }
}
