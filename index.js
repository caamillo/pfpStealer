const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs-extra')
const download = require('image-downloader');
const mkdirp = require('mkdirp')

const token = 'Token Here' // Token

const bot = new TelegramBot(token, {polling: true})

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]

    bot.sendMessage(chatId, 'Coglione')
})

const downloadImages = async (userId) => {
    if (fs.existsSync('users/' + userId)) fs.emptyDirSync('users/' + userId)
    else await mkdirp('users/' + userId)
    bot.getUserProfilePhotos(userId, 0).then(async (data) => {
        if (fs.existsSync('users/' + userId)) fs.emptyDirSync('users/' + userId)
        else await mkdirp('users/' + userId)
        data.photos.map((photo, cphoto) => {
            bot.getFileLink(photo[0].file_id).then(link => {
                download.image({
                    url: link,
                    dest: `./users/${ userId }/${ cphoto }.jpg`
                }).then(({ filename }) => {
                    console.log('File saved to', filename)
                })
                .catch(err => console.error(err));
            })
        })
    })
}

bot.onText(/\/propic (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]

    bot.sendMessage(chatId, resp)
    await downloadImages(resp)
})

bot.on('message', (msg) => {
    bot.getUserProfilePhotos(userId, 0).then(async data => {
        await downloadImages(userId)
    })
})