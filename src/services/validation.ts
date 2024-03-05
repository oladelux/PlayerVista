export const isPasswordValid = (password: string) => {
  const uppercaseRegex = /[A-Z]/
  const hasUppercase = uppercaseRegex.test(password)

  const lowercaseRegex = /[a-z]/
  const hasLowercase = lowercaseRegex.test(password)

  const digitRegex = /\d/
  const hasDigit = digitRegex.test(password)

  return {
    hasUppercase,
    hasLowercase,
    hasDigit,
  }
}
