const Discord = require(`discord.js`)
const client = new Discord.Client()
const fs = require(`fs`)
const readline = require('readline');
const path = require(`path`)

const introChannelID = `813935994831241279`
const colorMessageID = `813952685984186418`
const pronounMessageID = `813952686588035102`
const callOut = `oh pog`
const colorMap = new Map()
const pronounMap = new Map()
const namesMap = new Map()
const namesPath = path.join(__dirname, `./names.txt`)

client.on(`ready`, () => {
    // fetches the messages and stores them in cache (so they can be listened for)
    client.channels.fetch(introChannelID).then(channel => {
      channel.messages.fetch(colorMessageID)
      channel.messages.fetch(pronounMessageID)
    })

    // set emoji -> role map
    getEmojis()
    // set id -> names mao
    getNames()

    console.log(`Pog is ready to help!`)
})

client.on(`messageReactionAdd`, (reaction, user) => {
  // if not the bot
  if (!reaction.me) {
    // get server data
    const guild = reaction.message.guild
    // get member obj
    const member = guild.members.resolve(user.id)
    const emoji = reaction.emoji.name
    if (reaction.message.id === pronounMessageID) {
      if (pronounMap.has(emoji)) {
        member.roles.add(guild.roles.resolve(pronounMap.get(emoji)))
      }
    }
    else if (reaction.message.id === colorMessageID) {
      if (colorMap.has(emoji)) {
        // remove other reactions user has added
        colorMap.forEach((value, item) => {
          if (item != emoji) reaction.message.reactions.resolve(item).users.remove(member)
        })
        // set role of user to color
        member.roles.add(guild.roles.resolve(colorMap.get(emoji)))
      }
    }
  }
  return
})

client.on(`messageReactionRemove`, (reaction, user) => {
  if (!reaction.me) {
    const emoji = reaction.emoji.name
    if (colorMap.has(emoji) || pronounMap.has(emoji)) {
        // get server data
        // get member obj
        // get emoji details
        const guild = reaction.message.guild
        const member = guild.members.resolve(user.id)
        const emoji = reaction.emoji.name
        if (reaction.message.id == pronounMessageID) {
          // remove pronoun role
          member.roles.remove(pronounMap.get(emoji))
        }
        else if (reaction.message.id == colorMessageID) {
          // remove color role
          if (member.roles.cache.get(colorMap.get(emoji))) {
            member.roles.remove(guild.roles.resolve(colorMap.get(emoji)))
          }
        }
      }
    }
})

client.on(`message`, (msg) => {
  if (!msg.content.toLowerCase().includes(callOut)) return
  if (!msg.mentions.members) return
  if (msg.author.bot) return
  const { author, channel, mentions } = msg

  msg.delete().then(() => {
    mentions.members.forEach(({ id, displayName }) => {
      // check if member.id exists in userMap
      if (namesMap.has(id)) {
        // send dm with info
        return author.send(`${displayName} is ${namesMap.get(id)}! Hope that means something to you!`).catch(err => {
          channel.send(`I can't send you information if you have DMs turned off!`)
        })
      }
      else {
        return author.send(`I don't know who ${displayName} is. Sorry and good luck!`)
      }
    })
  }).catch(err => {
    console.error(`Catch block on message deletion: ${err}`)
  })
})

function getNames() {
  // fs.readFile(namesPath, `utf-8`, (err, data) => {
  //   if (err) return console.error(`Cannot read names.txt because ${err}!`)

    const rl = readline.createInterface({
      input: fs.createReadStream(namesPath),
      crlfDelay: Infinity
    })

    rl.on('line', line => {
      line = line.split(' ')
      namesMap.set(line[0], line[1])
    })
  // })
}

function getEmojis() {
  // set name color emojis map
  colorMap.set(`🌸`, `813934843451670578`)
  colorMap.set(`❤️`, `813934844887171113`)
  colorMap.set(`🔥`, `813934846715232257`)
  colorMap.set(`🧀`, `813934847810338856`)
  colorMap.set(`🌿`, `813934848761921547`)
  colorMap.set(`🦋`, `813935040504266804`)
  colorMap.set(`🔮`, `813935041813020683`)
  colorMap.set(`👻`, `813935286752247831`)

  // set pronoun emojis map
  pronounMap.set(`🍜`, `813935365579604010`)
  pronounMap.set(`🍟`, `813935363541172234`)
  pronounMap.set(`🥞`, `813935360878706789`)
}

client.login(process.env.POGTOKEN)