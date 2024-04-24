const telegram_api = require('node-telegram-bot-api');

const token = '5821224794:AAEci9qmrNARgc-lEjqhuCPUg5lxOCJwdq4';

const bot = new telegram_api(token, {polling: true});

const {game_options, again_option} = require('./options');

const chats = {};

const start_game = async (chat_id) => {
    await bot.sendMessage(chat_id, 'Попробуй угадать цифру от 0 до 9');
    const random_number = Math.floor(Math.random() * 10);
    chats[chat_id] = random_number;
    await bot.sendMessage(chat_id, 'Отгадывай', game_options);
};

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие '},
        {command: '/info', description: 'Сказать пользователю что это мой бот а то ведь он и не догадывается'},
        {command: '/game', description: 'Игра угадай цифру'}
    ]);
    
    bot.on('message', async msg => {
        const first_name = msg.from.first_name;
        const chat_id = msg.chat.id;
        const txt = msg.text;
        if (txt === '/start') {
            return bot.sendMessage(chat_id, `Welcome, dear ${first_name}`)
        };
        if (txt === '/info') {
            return bot.sendMessage(chat_id, 'It is my telegram bot^^')
        };
        if (txt === '/game') {
            return start_game(chat_id);
        };
        return bot.sendMessage(chat_id, 'Моя твоя не понимать');
    });
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chat_id = msg.message.chat.id;
        if (data === '/again') {
            return start_game(chat_id);
        };
        if (data == chats[chat_id]) {
            return bot.sendMessage(chat_id, `Вы выиграли, это была цифра ${chats[chat_id]}`, again_option)
        }
        else {
            return bot.sendMessage(chat_id, `Вы проиграли, бот загадал цифру ${chats[chat_id]}`, again_option)
        };
    })
};

start();