const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const http = require('http'); // Built-in Node tool

// 1. Create a tiny web server to keep the bot alive
http.createServer((req, res) => {
    res.write("Bot is online!");
    res.end();
}).listen(process.env.PORT || 3000);

// 2. Your Discord Bot Logic
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const PREFIX = '?';
const ROLES_TO_ADD = ['1551293270863257610'];    
const ROLES_TO_ADD = ['1551319031569715312']; 
const ROLES_TO_ADD = ['1551303608425906316'];   
const ROLES_TO_ADD = ['1551295859700928612'];   
const ROLES_TO_REMOVE = ['1551316997348794479']; 

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
            message.reply("Failed to update roles. Check hierarchy!");
        }
    }
});

client.login('MTU1MTMyNzIzNjg0ODg3NzY1OA.GYUt9s.0oS6T617FA9Bm2BcmBB0SlhmsQuotWo13vvFoE');
