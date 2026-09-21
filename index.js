const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const http = require('http'); // Built-in Node tool

// 1. Create a tiny web server to keep the bot alive on Render
http.createServer((req, res) => {
    res.write("Bot is online!");
    res.end();
}).listen(process.env.PORT || 3000);

// 2. Your Discord Bot Logic
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

const PREFIX = '?';

// Your designated Role IDs to add
const ROLES_TO_ADD = [
    '1551293270863257610',
    '1551319031569715312',
    '1551303608425906316',
    '1551295859700928612'
];    

// Your designated Role ID to remove
const ROLES_TO_REMOVE = ['1551316997348794479']; 

client.on('ready', () => {
    console.log(`✅ Success! Logged in as ${client.user.tag}`);
    console.log("The bot is awake and listening for commands.");
});

client.on('messageCreate', async (message) => {
    // Ignore messages from other bots or messages that don't start with the prefix
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '3emeenlist') {
        // Check if the executor has Manage Roles permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply("❌ You do not have permission to use this command.");
        }
        
        // Ensure a user was actually mentioned
        const targetMember = message.mentions.members.first();
        if (!targetMember) {
            return message.reply("❌ Please mention a user. Usage: `?3emeenlist @username`");
        }

        try {
            // STEP 1: Fully remove old roles and wait for Discord's API to complete the clear
            await targetMember.roles.remove(ROLES_TO_REMOVE);
            
            // STEP 2: Add a half-second delay to prevent data collisions / race conditions in Discord
            await new Promise(resolve => setTimeout(resolve, 500)); 

            // STEP 3: Securely append all new roles inside your array list
            await targetMember.roles.add(ROLES_TO_ADD);
            
            // Notify success in the text channel
            message.channel.send(`✅ Successfully updated roles for ${targetMember}! Removed old assignments and applied new enlisted statuses.`);
        } catch (error) {
            // Log out the precise roadblock details to your Render dashboard logs
            console.error("❌ CRITICAL ERROR SAVING ROLES:", error);
            message.reply("❌ Failed to modify roles. Please verify that my bot role is dragged ABOVE the roles it is trying to manage in your Server Settings!");
        }
    }
});

// Securely logins using Render Environment Variables
client.login(process.env.DISCORD_TOKEN);
