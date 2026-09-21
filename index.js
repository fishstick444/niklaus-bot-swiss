const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const http = require('http'); // Built-in Node tool

// 1. Create a tiny web server to keep the bot alive on Render
http.createServer((req, res) => {
    res.write("Bot is online!");
    res.end();
}).listen(process.env.PORT || 3000);

// 2. Your Discord Bot Logic
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const PREFIX = '?';

// FIXED: Combined all your roles into a single array list!
const ROLES_TO_ADD = [
    '1551293270863257610',
    '1551319031569715312',
    '1551303608425906316',
    '1551295859700928612'
];    

const ROLES_TO_REMOVE = ['1551316997348794479']; 

client.on('ready', () => {
    console.log(`✅ Success! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '3emeenlist') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply("You do not have permission.");
        }
        const targetMember = message.mentions.members.first();
        if (!targetMember) return message.reply("Please mention a user.");

        try {
            await targetMember.roles.remove(ROLES_TO_REMOVE);
            await targetMember.roles.add(ROLES_TO_ADD);
            message.channel.send(`Successfully updated roles for ${targetMember}!`);
        } catch (error) {
            console.error(error);
            message.reply("Failed to update roles. Check hierarchy!");
        }
    }
});

// Secure token deployment
client.login(process.env.DISCORD_TOKEN);
