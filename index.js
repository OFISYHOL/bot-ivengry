const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = '6146362086:AAHQzr35EYDquwimevGegAxhH5hIYNqkRQQ'

const bot = new TelegramApi(token,{polling:true})

const chats = {}

bot.setMyCommands([
    {command: '/start', description: 'Начало'},
    {command: '/info', description: 'Информация о тебе'},
    {command: '/game', description: 'Небольшая игра'}
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Описание игры: Бот загадывает число(от 0 до 10), а ты должен его угодать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Пропробуй отгадай!', gameOptions);
}
const start = () => {

    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;

        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/s/sempa1stickers5662/sempa1stickers5662_001.webp?v=1684989301')
            return  bot.sendMessage(chatId, `Приветствую, тебя!`)
        }
        if(text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name} Твой id: ${msg.from.id}`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Прости, я тебя не понял')
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Молодец! Ты угодал! Загаданным числом было ${chats[chatId]}`, againOptions)
        }
        else {
            return bot.sendMessage(chatId, `Неправильно,бот загадывал число ${chats[chatId]}`, againOptions)
        }
        bot.sendMessage(chatId, `Ты выбрал номер ${data}`)
        console.log(msg)
    })
}

start()