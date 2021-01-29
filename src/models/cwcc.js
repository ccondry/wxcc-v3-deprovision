const fetch = require('node-fetch')

module.exports = {
  async listUsers () {
    try {
      const url = 'https://rest.cjp.cisco.com/aws/api/security/users'
      const options = {
        method: 'GET',
        headers: {
          Authorization: process.env.CJP_TOKEN,
          From: process.env.CJP_FROM,
          Accept: 'application/json'
        }
      }
      
      const response = await fetch(url, options)
      const text = await response.text()
      if (response.ok) {
        return JSON.parse(text)
      } else {
        throw Error(`${response.status} ${response.statusText} - ${text}`)
      }
    } catch (e) {
      throw e
    }
  },
  async deleteUser (id) {
    if (!id) {
      return
    }
    try {
      const url = 'https://cms.produs1.ciscoccservice.com/cms/api/auxiliary-data/user-data/user/' + id
      const options = {
        method: 'DELETE',
        headers: {
          // Authorization: 'Bearer ' + process.env.JWT,
          Authorization: process.env.CJP_TOKEN,
          Accept: 'application/json',
          From: process.env.CJP_FROM,
          'Content-Type': 'application/json'
        }
      }
      
      const response = await fetch(url, options)
      const text = await response.text()
      if (response.ok) {
        return text
      } else {
        throw Error(`${response.status} ${response.statusText} - ${text}`)
      }
    } catch (e) {
      throw e
    }
  }
}