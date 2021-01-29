const ldapClient = require('simple-ldap-client')
// set up ldap client
const ldap = new ldapClient(process.env.LDAP_URL, process.env.LDAP_BASE_DN)

module.exports = ldap