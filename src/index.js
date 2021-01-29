require('dotenv').config()

const db = require('./models/db')
const cwcc = require('./models/cwcc')
const moment = require('moment')

async function main () {
  try {
    const cwccUserList = await cwcc.user.list()
    const cwccUsers = cwccUserList.details.users
    // console.log(cwccUsers[0])

    const query = {}
    const projection = {}
    const sort = {
      lastLogin: -1
    }
    const toolboxUsers = await db.find('toolbox', 'users', query, projection, sort)
    // const top3 = toolboxUsers.slice(0, 3)
    // console.log(top3)

    const toolboxUsersWithCwcc = toolboxUsers.filter(tu => {
      // include if toolbox user has cwcc users
      return cwccUsers.find(cu => {
        const cuid = cu.login.slice(8, 12)
        return cuid === tu.id
      })
    })

    console.log(toolboxUsers.length, 'total toolbox users')
    console.log(cwccUsers.length, 'total cwcc users')
    console.log(toolboxUsersWithCwcc.length, 'toolbox users with cwcc')

    // map relevant data to check users to delete
    const mappedUsers = toolboxUsersWithCwcc.map(tu => {
      // start mapping toolbox user data
      const ret = {
        toolboxId: tu.id,
        username: tu.username,
        firstName: tu.firstName, 
        lastName: tu.lastName, 
        lastToolboxLogin: moment(tu.lastLogin).fromNow()
      }

      // find matching cwcc rbarrows user
      const rick = cwccUsers.find(cu => {
        const cuid = cu.login.slice(8, 12)
        return cuid === tu.id && cu.login.startsWith('rbarrows')
      })
      // map rbarrow's cwcc ID, if found
      if (rick) {
        console.log('found rbarrows' + tu.id)
        ret.rickId = rick.id
      }
      
      // find matching cwcc sjeffers user
      const sandra = cwccUsers.find(cu => {
        const cuid = cu.login.slice(8, 12)
        return cuid === tu.id && cu.login.startsWith('sjeffers')
      })
      // map sjeffers's cwcc ID, if found
      if (sandra) {
        console.log('found sjeffers' + tu.id)
        ret.sandraId = sandra.id
      }

      return ret
    })

    const coty = mappedUsers.find(v => v.id === '0325')
    console.log(coty)
    process.exit(0)
  } catch (e) {
    console.log('error', e.message)
  }
}

main()