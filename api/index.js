var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5044414524:AAGXkue7mN0oXmPgKRgm0Mgzc2r1N6Udeuw'
const bot = new TelegramBot(token, {polling: true});


// Main Menu Bot
bot.content.onText(/\/star/, (msg) => {
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `Hello $(msg.chat.first_name), welcome...\n
        click/predict`
    );
});

//input requires i and v 
state = 0;
bot.onText(/\/predict/,(msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Masukan nilai x1|x2|x3 contohnya 30|88|122`
    );
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        x1 = s[0]
        x2 = s[1]
        x3 = s[2]
        model.predict(
            [
                parseFloat(s[0]), // string to  float
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
        ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `Nilai nx1 yang diprediksi adalah $(jres[0]) Volt`
            );
            bot.sendMessage(
                msg.chat.id,
                `Nilai nx2 yang diprediksi adalah $(jres[1]) Volt`
            );
            bot.sendMessage(
                msg.chat.id,
                `Nilai nx3 yang diprediksi adalah $(jres[2]) Volt`
        })
    }else{
        state = 0
    }
})

// routers
r.get('/prediction/:x1/:x2/:x3', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});


module.exports = r;
