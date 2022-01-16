module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.channels.cache.get('932250541319389207').send('Hello here!');
    },
};
