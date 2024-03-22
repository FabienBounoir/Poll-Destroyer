const { Client, GatewayIntentBits, Partials, ActivityType, Collection, MessageType, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const language = {
    "fr": "Les Sondages ne sont pas autorisé sur ce serveur.",
    "en-US": "Polls are not allowed on this server.",
    "en-GB": "Polls are not allowed on this server.",
    "de": "Umfragen sind auf diesem Server nicht erlaubt.",
    "es-ES": "Las encuestas no están permitidas en este servidor.",
    "it": "I sondaggi non sono consentiti su questo server.",
}

let pollDeleted = 0;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [
        Partials.Channel,
    ],
    presence: {
        status: "dnd",
        activities: [{ name: `🚨`, type: ActivityType.Custom }]
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    setInterval(() => {
        client.user.setActivity(`🗑️ Poll Deleted: ${pollDeleted}`, { type: ActivityType.Custom })
    }, 30000);
});

client.on('messageCreate', async (message) => {
    //check if user are manage message permissions
    if (message.member.permissions.has("ManageMessages")) return

    if (message.type != MessageType.Default) return
    if (message.system) return
    if (message.content != "") return
    if (message.embeds.length > 0) return
    if (message.attachments.size > 0) return
    if (message.stickers.size > 0) return
    console.log("🗑️ Deleted: ", message)

    message.delete().catch((e) => { console.log("DELETE POLL", e) })

    const embed = new EmbedBuilder()
        .setDescription("🚨 » " + language[message.guild.preferredLocale] || language["en-US"])
        .setColor("#AB2346")

    message.author.send({ embeds: [embed] }).catch((e) => { console.log("SEND DIRECT MESSAGE", e) })
    pollDeleted++
});

process.on("unhandledRejection", async (reason, promise) => {
    console.error(`[UncaughtException_Logs]`, `[REASON] ${reason}`, `[PROMISE REJECT] ${promise}`, reason.stack);
});

process.on("uncaughtException", async (err, origin) => {
    console.error(`[UncaughtException_Logs] ${err}`, `Exception origin: ${origin}`, err.stack);
});

client.login(process.env.TOKEN);