const { ActivityType } = require('discord.js');

const statuses = [
  {
    name: 'Hentai Simulator',
    type: ActivityType.Playing,
  },
  {
    name: 'Eating Mustache Hair',
    type: ActivityType.Custom,
  },
  {
    name: 'Ram Ranch',
    type: ActivityType.Listening,
  },
  {
    name: 'Billy Graham Classics',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    name: 'the Fry Cook Games',
    type: ActivityType.Competing,
  },
  {
    name: 'your mom',
    type: ActivityType.Watching,
  }
];

function chooseStatuses(client) {
  var random = Math.floor(Math.random() * statuses.length);

  client.user.setActivity(statuses[random]);
}

module.exports = { statuses, chooseStatuses };