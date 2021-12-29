var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5018882223:AAGmHJoDlgh-defHVhu3w-idGNEKaPYBi_c'
const bot = new TelegramBot(token, {polling: true});


// bots
let state = 2;
bot.onText(/\/start/, (msg) => {    
    state = 0;
    bot.sendMessage(
        msg.chat.id,
        `Selamat datang di BOT prediksi Tegangan & Daya menggunakan Deep Neural Network.
        \nSilahkan pilih menu dibawah ini:\n
        (/1) Prediksi dengan Input i|r
        (/2) Batal`
    ); 
    bot.sendMessage(msg.chat.id, "Pilihan Anda: ");    
});

bot.onText(/\/1/, (msg) => {
    state = 1;
    bot.sendMessage(
        msg.chat.id, 
        `Masukan nilai i dan r
        contohnya: 12|36`
    );   
});

bot.onText(/\/2/, (msg) => {
    state = 2;
    bot.sendMessage(
        msg.chat.id, 
        "pilih /start untuk kembali ke menu utama"
    );   
});

bot.on('message', (msg) => {
    const text = msg.text.toString().toLowerCase();
    console.log(text);

    if(state == 1){
        let dt = text.split('|');
        bot.sendMessage(
            msg.chat.id, 
            `prediksi tegangan dan daya dengan arus (${dt[0]} A) dan resistansi (${dt[1]} Ohm) `
        );

        model.predict(
            [
                parseFloat(dt[0]), // string to float
                parseFloat(dt[1])
            ]
        ).then((jres) => {
            bot.sendMessage(
                msg.chat.id, 
                `nilai v dan p adalah (${jres[0]} volt) dan (${jres[1]} watt)`
            );
            bot.sendMessage(
                msg.chat.id,
                `<= kembali /2`
            );
        });        
    }

    if(state == 2){
        bot.sendMessage(
            msg.chat.id, 
            "pilih /start untuk ke menu utama"
        );   
    }
})



// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});


module.exports = r;
