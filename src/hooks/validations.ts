export default {
  validateEmailAddress(emailString: string) {
    const atSymbol = emailString.indexOf('@')
    if (atSymbol < 1) return false

    const dot = emailString.lastIndexOf('.')
    if (dot <= atSymbol + 2) return false

    return dot !== emailString.length - 1
  },
  validateRequiredField(fieldString: string) {
    if (!fieldString) {
      return false
    }
    return fieldString.length > 0
  },
  validatePassword: function (confirmedPassword: string, password: string) {
    if (!confirmedPassword) {
      return false
    }
    return confirmedPassword === password
  }
}
