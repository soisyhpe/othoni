module.exports = {
  fetchInterval: 5, // every 10 minutes
  defaultOffset: 0,
  defaultLimit: 10,
  cacheExpirationInMilliseconds: 60000, // 1000 (1 second) * 60 (seconds in 1 minute) = 1 minute
  usersCollection: 'users', // for users management
  serversCollection: 'servers', // for server list
  monitoringCollection: 'monitoring' // for recording servers activity
}