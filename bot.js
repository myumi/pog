const Discord = require('discord.js')
const client = new Discord.Client()
const introChannelID = '813935994831241279'
const colorMap = new Map()
const pronounMap = new Map()
let colorMessageID = '813952685984186418'
let pronounMessageID = '813952686588035102'

colorMap.set('🌸', '813934843451670578')
colorMap.set('❤️', '813934844887171113')
colorMap.set('🔥', '813934846715232257')
colorMap.set('🧀', '813934847810338856')
colorMap.set('🌿', '813934848761921547')
colorMap.set('🦋', '813935040504266804')
colorMap.set('🔮', '813935041813020683')
colorMap.set('👻', '813935286752247831')
pronounMap.set('🍜', '813935365579604010')
pronounMap.set('🍟', '813935363541172234')
pronounMap.set('🥞', '813935360878706789')

client.on('ready', () => {
    // makes these messages
    // colorMessageSetup()
    // pronounMessageSetup()

    // fetches the messages and stores them in cache (so they can be listened for)
    client.channels.fetch(introChannelID).then(channel => {
      channel.messages.fetch(colorMessageID)
      channel.messages.fetch(pronounMessageID)
    })
    // client.channels.fetch(introChannelID).then(channel => channel.message.fetch(pronounMessageID))
    console.log(`Logged in as ${client.user.tag}!`)
});

function colorMessageSetup() {
  // make a message for reacting for name color
  const colorMessage = `Welcome!
If you'd like to change the color of your name, add a reaction to this post of the corresponding color.
(Possible answers have already been added)

You can change this at any time.`
  // send message
  client.channels.cache.get(introChannelID).send(colorMessage)
    .then(sent => {
      colorMessageID = sent.id
      sent.react('🌸')
      sent.react('❤️')
      sent.react('🔥')
      sent.react('🧀')
      sent.react('🔥')
      sent.react('🌿')
      sent.react('🦋')
      sent.react('🔮')
      sent.react('👻')
    })
  // react with proper reactions
}

function pronounMessageSetup() {
  // make a message for reacting for pronouns
  const pronounMessage = `If you'd prefer certain pronouns, add a reaction to this post.
**You can select multiple!**
🍜 = they/them
🍟 = she/her
🥞 = he/him

Now I'm hungry...`
  // send message
  client.channels.cache.get(introChannelID).send(pronounMessage)
    .then(sent => {
      pronounMessageID = sent.id
      sent.react('🍜')
      sent.react('🍟')
      sent.react('🥞')
    })
  // react with proper reactions
}

client.on('messageReactionAdd', (reaction, user) => {
  // if not the bot
  if (!reaction.me) {
    // get server data
    const guild = reaction.message.guild
    // get member obj
    const member = guild.members.resolve(user.id)
    const emoji = reaction._emoji.name
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

client.on('messageReactionRemove', (reaction, user) => {
  if (!reaction.me) {
    const emoji = reaction._emoji.name
    if (colorMap.has(emoji) || pronounMap.has(emoji)) {
        // get server data
        const guild = reaction.message.guild
        // get member obj
        const member = guild.members.resolve(user.id)
        const emoji = reaction._emoji.name
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

client.login(process.env.VJTOKEN)