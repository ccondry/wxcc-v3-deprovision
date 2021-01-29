require('dotenv').config()

const cwcc = require('./models/cwcc')
const ldap = require('./models/ldap')
const getOldUsers = require('./models/get-old-users')

async function deleteLdapUser (cn) {
  return ldap.deleteUser({
    adminDn: process.env.LDAP_ADMIN_DN,
    adminPassword: process.env.LDAP_ADMIN_PASSWORD,
    userDn: `CN=${cn},${process.env.LDAP_USER_SEARCH_DN}`
  })
}

async function clean () {
  let successCount = 0
  let failedCount = 0
  const oldUsers = await getOldUsers()
  const users = oldUsers
  console.log('found', users.length, 'to delete')
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    console.log('starting delete for user', user.username, user.toolboxId)
    
    // delete rick from cwcc
    try {
      if (user.rickId) {
        console.log(`deleting rbarrows${user.toolboxId} (${user.rickId}) from CJP...`)
        await cwcc.deleteUser(user.rickId)
        console.log(`successfully deleted rbarrows${user.toolboxId} from CJP`)
      }
    
      // delete sandra from cwcc
      if (user.sandraId) {
        console.log(`deleting sjeffers${user.toolboxId} (${user.sandraId}) from CJP...`)
        await cwcc.deleteUser(user.sandraId)
        console.log(`successfully deleted sjeffers${user.toolboxId} from CJP`)
      }

      // delete rick from LDAP
      const rickCn = `Rick Barrows${user.toolboxId}`
      const sandraCn = `Sandra Jefferson${user.toolboxId}`
      try {
        await deleteLdapUser(rickCn)
      } catch (e) {
        // continue
        console.log('failed to delete LDAP user', rickCn, ':', e.message)
      }
      try {
        await deleteLdapUser(sandraCn)
      } catch (e) {
        // continue
        console.log('failed to delete LDAP user', sandraCn, ':', e.message)
      }
      successCount++
    } catch (e) {
      failedCount++
      console.log(`failed during delete user ${user}:`, e.message)
    }
  }
  console.log('done! successfully deleted', successCount, 'user objects, failed to delete', failedCount, 'user objects.')
  process.exit(0)
}

clean()