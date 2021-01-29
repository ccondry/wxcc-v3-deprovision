require('dotenv').config()

const fs = require('fs')
const getOldUsers = require('./models/get-old-users')

const maxUsers = process.env.MAX_USERS
const filename = 'test.csv'

async function createCsv () {
  // get oldest users
  const usersToDelete = await getOldUsers(maxUsers) 
  // enumerate columns using first user object
  // const columns = Object.keys(usersToDelete[0])
  const columns = [
    'User ID',
    'Username',
    'Email',
    'First Name',
    'Last Name',
    'Last Login to Toolbox',
    'Rick ID',
    'Sandra ID'
  ]
  // create CSV file with columns row and add newline
  fs.writeFileSync(filename, columns.join(', ') + '\r\n')
  // write each user to new line
  for (let i = 0; i < usersToDelete.length; i++) {
    const user = usersToDelete[i]
    // make an array of the user's data
    const line = [
      user.toolboxId,
      user.username,
      user.email,
      user.firstName, 
      user.lastName, 
      user.lastToolboxLogin,
      user.rickId || '',
      user.sandraId || ''
    ]
    // add comma-separated user data to line and add newline
    fs.appendFileSync(filename, line.join(', ') + '\r\n')
  }
  console.log('wrote', filename)
  process.exit(0)
}

createCsv()