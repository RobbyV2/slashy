var version = "1.4";
//Version 1.4
const axios = require('axios');
const cors = require('cors');
const path = require('path');

axios.get('https://raw.githubusercontent.com/TahaGorme/slashy/main/index.js')
    .then(function (response) {
        var d = response.data;
        if (d.match(/Version [0-9]*\.[0-9]+/)) {
            console.log("Version " + version)
            if (d.match(/Version [0-9]*\.[0-9]+/)[0].replace("Version ", "") !== version) {
                console.log("There is a new version " + d.match(/Version [0-9]*\.[0-9]+/)[0].replace("Version ", "") + " available. Please update. https://github.com/TahaGorme/slashy")
            }

            // console.log(d.replace("Version ",""));

        }
        // console.log(.replace("Version ",""));
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {

    });



process.on('unhandledRejection', (reason, p) => {
    console.log(' [Anti Crash] >>  Unhandled Rejection/Catch');
    console.log(reason, p)
})

process.on('uncaughtException', (e, o) => {
    console.log(' [Anti Crash] >>  Uncaught Exception/Catch');
    console.log(e, o)
})

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(' [AntiCrash] >>  Uncaught Exception/Catch (MONITOR)');
    console.log(err, origin);
});

process.on('multipleResolves', (type, promise, reason) => {
    console.log(' [AntiCrash] >>  Multiple Resolves');
    console.log(type, promise, reason);
});

var bank = 0;
const chalk = require('chalk');

var purse = 0;
var net = 0;
const config = require('./config.json');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

app.enable("trust proxy");
app.use(cors());

// set the view engine to ejs

app.get("/", async (req, res) => {
    res.render(path.resolve("./static"), {
        //   "progressValue": pr
    });
});

app.get("/api", async (req, res) => {

    res.json({

        "bank": bank,
        "purse": purse,
        "net": net
    })
});


app.listen(7500);
console.log(chalk.green('server started on localhost:7500'));


// console.log(config.tokens)

const { Client, Discord } = require('discord.js-selfbot-v13');

const client1 = new Client({ checkUpdate: false, readyStatus: false });

client1.on('ready', async () => {
    console.log(chalk.yellow(`Logged in to Main Account as ${client1.user.tag}!`));
    client1.user.setStatus('invisible');

})
client1.login(config.mainAccount);
start()
async function start() {
    for (var i = 0; i < config.tokens.length; i++) {
        await doEverything(config.tokens[i].token, Client, client1, config.tokens[i].channelId);
    }
}
async function doEverything(token, Client, client1, channelId) {
    var channel;

    const { Webhook } = require('discord-webhook-node');


    const figlet = require('figlet');
    const client = new Client({ checkUpdate: false, readyStatus: false });
    const botid = "270904126974590976";
    var commandsUsed = [];
    var ongoingCommand = false;
    const hook = new Webhook(config.webhook);


    const fs = require('fs-extra')
    async function findAnswer(question) {
        const trivia = await fs.readJson('./trivia.json')
        for (let i = 0; i < trivia.database.length; i++) {
            if (trivia.database[i].question.includes(question)) {
                return trivia.database[i].correct_answer;
            }
        }
    }

    client.on('ready', async () => {
        client.user.setStatus('invisible');

        console.log(
            chalk.yellow(
                figlet.textSync('Slashy', { horizontalLayout: 'full' })
            )
        );
        console.log(chalk.green(`Logged in as ${chalk.cyanBright(client.user.tag)}`));


        channel = client.channels.cache.get(channelId);
        if (!channel) return console.log(chalk.red("Channel not found! " + channelId));

        console.log(chalk.magenta("Playing Dank Memer in " + channel.name))
        hook.send("Started. Playing Dank Memer in <#" + channel.id + ">");
        if (config.transferOnlyMode) {
            console.log(chalk.red("Transfer Only Mode is enabled."))
            inv(botid, channel)
            return;
        }
        await channel.sendSlash(botid, "balance")



        main(channel)



    })

    client.on('messageCreate', async (message) => {
        if (!channel) return;

        if (message.flags.has('EPHEMERAL')) return;
        if (message.author.id === botid) {

            if (message.embeds[0].author) {
                if (message.channel.id === channel.id && message.embeds[0].author.name.includes(client.user.username + "'s inventory") && config.autoGift) {
                    // transfer(message, 2);

                    setTimeout(async () => {
                        var name = message.embeds[0].description.split("\n")[0].split("** ─")[0].split("**")[1];
                        if (config.giftBlacklist.includes(name.toLowerCase())) {
                            return;
                        };
                        var quantity = message.embeds[0].description.split("\n")[0].split("─ ")[1]
                        console.log(name)
                        console.log(quantity)
                        // /market post for_coins type:sell quantity:1 item:Ant for_coins:1 days:1 allow_partial:False private:True

                        await channel.sendSlash(botid, "market post for_coins", "sell", quantity, name, quantity, "1", "False", "True")


                    }, randomInteger(300, 700));
                    // console.log("Posted " + quantity + " " + name + " for 1 coin")
                    //  transfer(message, 0)
                }
            }
            // console.log(message.embeds[0])
            if (message.channel.id === channel.id && config.autoGift && message.embeds[0] && message.embeds[0].description && message.embeds[0].description.includes("To post this offer, you will pay a fee")) {

                transfer(message, 0)
            }

            if (message.channel.id === channel.id && config.autoGift && message.embeds[0] && message.embeds[0].description && message.embeds[0].description.includes("Posted an offer to sell")) {

                //             Posted an offer to sell **23x <:Alcohol:984501149501653082> Alcohol** on the market.\n' +
                // 'This offer is not publicly visible. Offer ID: `PVN3OP02`
                //get text after : 
                var offerID = message.embeds[0].description.split("Offer ID: `")[1].split("`")[0]
                console.log(offerID)



                const channel1 = client1.channels.cache.get(channelId);
                if (!channel1) return;

                setTimeout(async function () {

                    console.log("SENDING SLASH COMMAND")
                    await channel1.sendSlash(botid, "market accept", offerID)

                    client1.on('messageCreate', async (message) => {
                        if (message.author.id === botid) {
                            if (message.embeds[0] && message.embeds[0].title && message.embeds[0].title.includes("Pending Confirmation")) {
                                highLowRandom(message, 1)
                                console.log("Accepted offer " + offerID)
                                if (config.transferOnlyMode) {
                                    setTimeout(async function () {
                                        inv(botid, channel)
                                        setTimeout(async function () {
                                            inv(botid, channel)
                                        }, randomInteger(config.cooldowns.transfer.minDelay, config.cooldowns.transfer.maxDelay));

                                    }, randomInteger(config.cooldowns.transfer.minDelay, config.cooldowns.transfer.maxDelay));

                                }
                            }
                            // if (message.embeds[0].description.includes("Are you sure you want to accept this offer?")) {
                            //     transfer(message, 1)
                            //     console.log("Accepted offer " + offerID)
                            // }
                            if (message.embeds[0].title && message.embeds[0].title.toLowerCase().includes("captcha") && message.embeds[0].description.toLowerCase().includes("matching image")) {
                                console.log(chalk.red("Captcha!"))

                                // var captcha = message.embeds[0].image.url;
                                //get embed thubmnail
                                var captcha = message.embeds[0].image.url;
                                console.log("image" + captcha)
                                const components = message.components[0]?.components;
                                hook.send(captcha)
                                for (var a = 0; a <= 3; a++) {
                                    var buttomEmoji = components[a].emoji.id;
                                    console.log("buttonEMoji" + buttomEmoji)
                                    hook.send(buttomEmoji)


                                    if (captcha.includes(buttomEmoji)) {
                                        console.log(components[a].customId)
                                        await message.clickButton(components[a].customId)
                                        console.log(chalk.green("Captcha Solved :)"))
                                        break;
                                    }

                                }

                            }
                            if (message.embeds[0] && message.embeds[0].title && message.embeds[0].title.toLowerCase().includes("captcha") && message.embeds[0].description.toLowerCase().includes("pepe")) {

                                var pepe = [
                                    "819014822867894304", "796765883120353280",
                                    "860602697942040596", "860602923665588284",
                                    "860603013063507998", "936007340736536626",
                                    "933194488241864704", "680105017532743700"
                                ]

                                for (var i = 0; i <= 3; i++) {
                                    const components = message.components[i]?.components;
                                    for (var a = 0; a <= 3; a++) {
                                        var buttomEmoji = components[a].emoji.id;
                                        if (pepe.includes(buttomEmoji)) {
                                            setTimeout(async () => {
                                                await message.clickButton(components[a].customId)

                                            }, randomInteger(config.cooldowns.buttonClick.minDelay, config.cooldowns.buttonClick.maxDelay));

                                        }

                                    }
                                }
                            }



                        }
                    })

                }, randomInteger(config.cooldowns.market.minDelay, config.cooldowns.market.maxDelay));



            }

            if (message.channel.id === channel.id && message.embeds[0].title && message.embeds[0].title === "Pending Confirmation") {
                highLowRandom(message, 1)
                // console.log(chalk.yellow("Sold all sellable items."))

            }

            if (message.embeds[0].title && message.embeds[0].title.toLowerCase().includes("captcha") && message.embeds[0].description.toLowerCase().includes("matching image")) {
                console.log(chalk.red("Captcha!"))
                // var captcha = message.embeds[0].image.url;
                //get embed thubmnail
                var captcha = message.embeds[0].image.url;
                hook.send(captcha)

                const components = message.components[0]?.components;

                for (var a = 0; a <= 3; a++) {
                    var buttomEmoji = components[a].emoji.id;

                    if (captcha.includes(buttomEmoji)) {
                        hook.send(buttomEmoji)

                        console.log(components[a].customId)
                        await message.clickButton(components[a].customId)
                        console.log(chalk.green("Captcha Solved :)"))
                        break;
                    }

                }

            }

            if (message.embeds[0].title && message.embeds[0].title.toLowerCase().includes("captcha") && message.embeds[0].description.toLowerCase().includes("pepe")) {

                var pepe = [
                    "819014822867894304", "796765883120353280",
                    "860602697942040596", "860602923665588284",
                    "860603013063507998", "936007340736536626",
                    "933194488241864704", "680105017532743700"
                ]

                for (var i = 0; i <= 3; i++) {
                    const components = message.components[i]?.components;
                    for (var a = 0; a <= 3; a++) {
                        var buttomEmoji = components[a].emoji.id;
                        for (var c = 0; c < pepe.length; c++) {
                            if (buttomEmoji === pepe[c]) {
                                setTimeout(async () => {
                                    await message.clickButton(components[a].customId)

                                }, randomInteger(400, 700));
                            }
                        }

                    }
                }
            }





            if (config.transferOnlyMode) return;


            if (message.embeds[0].title && message.embeds[0].title.includes(client.user.tag + "'s balance")) {
                purse = message.embeds[0].description.split("\n")[0].replace("**Wallet**: ", "");
                bank = message.embeds[0].description.split("\n")[1].replace("**Bank**: ", "");
                net = message.embeds[0].description.split("\n")[2].replace("**Net**: ", "");
                // console.log(coins)
                // console.log(bank)
                // console.log(net)
            }

            if (message.channel.id === channel.id && commandsUsed.includes('search') && message.embeds[0] && message.embeds[0].description && message.embeds[0].description.includes("Where do you want to search?")) {
                clickRandomButton(message, 0)
            }
            if (message.channel.id === channel.id && commandsUsed.includes('crime') && message.embeds[0] && message.embeds[0].description && message.embeds[0].description.includes("What crime do you want to commit?")) {
                clickRandomButton(message, 0)
            }
            if (message.channel.id === channel.id && commandsUsed.includes('postmemes') && message.embeds[0] && message.embeds[0].description && message.embeds[0].description.includes("Pick a meme to post to the internet")) {
                clickRandomButton(message, 0)
            }


            if (message.channel.id === channel.id && commandsUsed.includes('trivia') && message.embeds[0] && message.embeds[0].description && message.embeds[0].description.includes(" seconds to answer*")) {
                var time = message.embeds[0].description
                var question = message.embeds[0].description.replace(/\*/g, '').split("\n")[0].split('"')[0];

                let answer = await findAnswer(question);

                selectTriviaAnswers(message, answer)

            }
            if (message.channel.id === channel.id && commandsUsed.includes('highlow') && message.embeds[0] && message.embeds[0].description && message.embeds[0].description.includes("I just chose a secret number between 1 and 100.")) {

                var a = message.embeds[0].description.replace("I just chose a secret number between 1 and 100.", "");
                var b = a.replace("Is the secret number *higher* or *lower* than **", "");
                var c = parseInt(b.replace("**?", "").trim())

                if (c > 50) {
                    highLowRandom(message, 0)

                }
                if (c <= 50) {
                    highLowRandom(message, 2)

                }

            }

        }

    });

    client.login(token);

    async function main(channel) {
        var a = randomInteger(config.cooldowns.commandInterval.minDelay, config.cooldowns.commandInterval.maxDelay);
        var b = randomInteger(config.cooldowns.shortBreak.minDelay, config.cooldowns.shortBreak.maxDelay);

        var c = randomInteger(config.cooldowns.longBreak.minDelay, config.cooldowns.longBreak.maxDelay);

        randomCommand(channel)

        if (config.autoDeposit && randomInteger(0, 100) === 2) {
            await channel.sendSlash(botid, "deposit", "max")
            console.log(chalk.yellow("Deposited all coins in the bank."))
        }

        if (!config.transferOnlyMode && config.autoGift && randomInteger(0, 90) === 7) {
            await channel.sendSlash(botid, "inventory")

        }

        if (!config.transferOnlyMode && randomInteger(0, 30) === 3) {
            await channel.sendSlash(botid, "balance")
        }

        if (config.autoSell && randomInteger(0, 4) === 100) {
            await channel.sendSlash(botid, "sell all")


        }


        if (randomInteger(0, 250) == 50) {
            console.log("\x1b[34m", "Taking a break for " + b / 1000 + " seconds.")
            hook.send("Taking a break for " + b / 1000 + " seconds.")

            setTimeout(async function () {
                main(channel)
            }, b);
        } else if (randomInteger(0, 1400) == 400) {
            console.log("\x1b[35m", "Sleeping for " + c / 1000 / 60 + " minutes.")
            hook.send("Sleeping for " + c / 1000 / 60 + " minutes.")

            setTimeout(async function () {
                main(channel)
            }, c);
        } else {
            setTimeout(async function () {
                main(channel)
            }, a);
        }
    }
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    async function randomCommand(channel) {
        if (config.transferOnlyMode) return;
        let command = config.commands[random(0, config.commands.length - 1)];
        if (commandsUsed.includes(command)) return;
        console.log("\x1b[0m", "Using command " + command)
        commandsUsed.push(command)


        ongoingCommand = true;

        if (command === "beg") {
            await channel.sendSlash(botid, "beg")

            handleCommand(command, "beg", 51000, 55000)

        } else if (command === "fish") {
            await channel.sendSlash(botid, "fish")

            handleCommand(command, "fish", 46000, 50000)

        } else if (command === "hunt") {
            await channel.sendSlash(botid, "hunt")

            handleCommand(command, "hunt", 46000, 50000)

        } else if (command === "dig") {
            await channel.sendSlash(botid, "dig")

            handleCommand(command, "dig", 46000, 50000)

        } else if (command === "search") {
            await channel.sendSlash(botid, "search")

            handleCommand(command, "search", 36000, 42000)

        } else if (command === "crime") {
            await channel.sendSlash(botid, "crime")

            handleCommand(command, "crime", 49000, 55000)

        } else if (command === "postmemes") {
            await channel.sendSlash(botid, "postmemes")

            handleCommand(command, "postmemes", 53000, 64000)

        } else if (command === "highlow") {
            await channel.sendSlash(botid, "highlow")

            handleCommand(command, "highlow", 53000, 64000)

        } else if (command === "trivia") {
            await channel.sendSlash(botid, "trivia")

            handleCommand(command, "trivia", 6500, 10000)

        }
    }
    function removeAllInstances(arr, item) {
        for (var i = arr.length; i--;) {
            if (arr[i] === item) arr.splice(i, 1);
        }
    }

    async function handleCommand(command, com, delaymin, delaymax) {
        if (command === com) {
            ongoingCommand = false;

            setTimeout(() => {
                removeAllInstances(commandsUsed, com);
            }
                , delaymin)

        }
    }

    async function clickRandomButton(message, rows) {
        setTimeout(async () => {

            const components = message.components[randomInteger(0, rows)]?.components;
            const len = components?.length;
            let customId;
            if (len == NaN) return;
            customId = components[Math.floor(Math.random() * len)].customId;
            return await message.clickButton(customId);

        }, randomInteger(config.cooldowns.buttonClick.minDelay, config.cooldowns.buttonClick.maxDelay))
    }



    async function highLowRandom(message, number) {
        setTimeout(async () => {

            const components = message.components[0]?.components;
            const len = components?.length;
            let customId;
            if (len == NaN) return;
            customId = components[number].customId;
            return await message.clickButton(customId);

        }, randomInteger(config.cooldowns.buttonClick.minDelay, config.cooldowns.buttonClick.maxDelay))
    }

    async function transfer(message, number) {
        setTimeout(async () => {

            const components = message.components[1]?.components;
            const len = components?.length;
            let customId;
            // console.log(components)
            if (len == NaN) return;
            customId = components[number].customId;
            return await message.clickButton(customId);

        }, randomInteger(config.cooldowns.buttonClick.minDelay, config.cooldowns.buttonClick.maxDelay))
    }

    async function selectTriviaAnswers(message, ans) {
        setTimeout(async () => {
            var flag = false;

            const components = message.components[0]?.components;
            const len = components?.length;
            let customId;
            if (len == NaN) return;

            for (var i = 0; i < components.length; i++) {
                if (components[i].label.includes(ans)) {
                    customId = components[i].customId;
                    flag = true;
                    return await message.clickButton(customId);
                }
            }
            if (!flag || ans === undefined) {
                customId = components[randomInteger(0, 3)].customId;
                return await message.clickButton(customId);

            }

        }, randomInteger(config.cooldowns.trivia.minDelay, config.cooldowns.trivia.maxDelay))

    }
    function randomInteger(min, max) {
        if (min == max) {
            return min;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

async function inv(botid, channel) {
    await channel.sendSlash(botid, "inventory")

}
