const login = require("facebook-chat-api");

// Create simple echo bot
login({email: "tartsmallbig@gmail.com", password: "SSHStart1"}, (err, api) => {
    if(err) return console.error(err);
    api.setOptions({listenEvents:true});
    api.listenMqtt((err, message) => {

        api.sendMessage(message.body, message.threadID);
    });
});
