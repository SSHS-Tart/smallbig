require("dotenv").config();
const { promises: fs } = require("fs");
const { promisify } = require("util");
const log = require("npmlog");
const login = promisify(require("facebook-chat-api"));
const NOT_VOTING = "not-voting";
const VOTING = "voting";

(async () => {
    let credentials;
    try {
        let appState = JSON.parse(await fs.readFile("appstate.json", "utf8"));
        credentials = { appState };
    } catch (err) {
        log.info("credentials", "appstate.json doesn't exist.");
        credentials = {
            email: process.env.FB_EMAIL,
            password: process.env.FB_PWD
        };
    }
    try {
        let api = await login(credentials);
        if (!credentials.appState) {
            await fs.writeFile("appstate.json", JSON.stringify(api.getAppState()));
        }
        let state = NOT_VOTING;
        let candidates = new Map/*<String, Number>*/();

        api.listenMqtt((err, message) => {
            let id = message.threadID;
            let send = (body) => api.sendMessage(body, id);
            if (err) {
                log.error("listenMqtt", err);
                return;
            }

            if (!message.body) {
                return;
            }

            if (state == NOT_VOTING && message.body == "votestart") {
                state = VOTING;
                send("state changed - voting");
            } else if (state == VOTING) {
                if (message.body == "end") {
                    let maxCount = 0;
                    let winners = [];
                    for (let [candidate, count] of candidates.entries()) {
                        if (count > maxCount) {
                            winners = [candidate];
                            maxCount = count;
                        } else if (maxCount == count) {
                            winners.push(candidate);
                        }
                    }
                    if (winners.length > 0) {
                        send(`candidate ${winners.join()} got the most votes - current count ${maxCount}`);
                    }
                    state = NOT_VOTING;
                    candidates.clear();
                    send("state changed - not voting");
                    return;
                }
                let candidate = message.body;
                let count = candidates.get(candidate) || 0;
                candidates.set(candidate, count + 1);
                send(`voted candidate '${candidate}' - current count ${count + 1}`);
            }
        });
    } catch (err) {
        log.error("login", err);
    };
})();
