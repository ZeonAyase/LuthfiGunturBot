var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5044414524:AAGXkue7mN0oXmPgKRgm0Mgzc2r1N6Udeuw'
const bot = new TelegramBot(token, {polling: true});


// bots
let state = 2;
bot.onText(/\/start/, (msg) => {    
    state = 0;
    bot.sendMessage(
        msg.chat.id,
        `Selamat datang Muhammad Luthfi Guntur Putra. 
        \nSilahkan pilih menu dibawah ini:\n
        click(/predict) Prediksi dengan Input x1|x2|x3
        click(/close) Menu batal`
    ); 
    bot.sendMessage(msg.chat.id, "Pilihan Anda: ");    
});

bot.onText(/\/predict/, (msg) => {
    state = 1;
    bot.sendMessage(
        msg.chat.id, 
        `Masukan nilai x1, x2, dan x3
        contohnya: 30|88|122 `
    );   
});

bot.onText(/\/close/, (msg) => {
    state = 2;
    bot.sendMessage(
        msg.chat.id, 
        "pilih /start untuk kembali ke menu utama"
    );   
});

bot.on('message', (msg) => {
    if(state == 1){
        let dt = text.split('|');
        x1 = dt[0]
        x2 = dt[1]
        x3 = dt[2]
        
        bot.sendMessage(
            msg.chat.id, 
            `x1 (${dt[0]} Volt)`
        );
         bot.sendMessage(
            msg.chat.id, 
            `x1 (${dt[1]} Volt)`
        );
        bot.sendMessage(
            msg.chat.id,
            `x3 (${dt[2]} Volt)`
        );
        
        model.predict(
            [
                parseFloat(dt[0]), // string to float
                parseFloat(dt[1]),
                parseFloat(dt[2])
            ]
         ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `Nilai nx1 yang diprediksi adalah (${jres[0]}) Volt`
            );
            bot.sendMessage(
                msg.chat.id,
                `Nilai nx2 yang diprediksi adalah (${jres[1]}) Volt`
            );
            bot.sendMessage(
                msg.chat.id,
                `Nilai nx3 yang diprediksi adalah (${jres[2]}) Volt`
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
