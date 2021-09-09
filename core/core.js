/** __   __   __  ___  ___
 * /  ' /  \ |__)  |  |__  \_/
 * \__. \__/ |  \  |  |___ / \
 *
 * @copyright © 2021 hepller
 */

// Импорт модулей и функций
const {VK} = require('vk-io')
const Markov = require('markov-generator')

/** Функции */
const Utils = require('./utils')

// Конфиг, паттерн и файл проекта
const config = require('../config')
const data = require('../data')
const project = require('../package')

/** VK API */
const vk = new VK({token: config.token, v: 5.131})

// Префиксы для логирования
const succes_prefix = '\u001B[32m>\u001B[0m'
const warn_prefix = '\u001B[33m>\u001B[0m'
const error_prefix = '\u001B[31m>\u001B[0m'

// Сообщения при запуске
console.log(succes_prefix, `Cortex Bot v${project.version}`)
console.log(succes_prefix, 'VK API connection ...')

// Запуск обработчика событий ВК
vk.updates.startPolling().then(() => console.log(succes_prefix, 'Successfully connected'))

// Обработчик сообщений ВК
vk.updates.on('message_new', async ctx => {

  // Игнорирование лишних сообщений
  if (!ctx.isChat || ctx.isOutbox || ctx.isGroup) return

  // Генерация сообщения с определенным шансом
  if (Utils.getWithChance(config.chance)) {

    // Статус набора текста
    await ctx.setActivity()

    /** Сгенерированный текст */
    const sentence = new Markov({input: data, minLenght: config.min_words}).makeChain()

    // Предупреждение при превышении лимита символов
    if (sentence.split('').length > config.max_symbols) return console.warn(warn_prefix, `#${ctx.chatId} Symbols limit exceeded (${sentence.split('').length}/${config.max_symbols})`)

    // Отправка сообщения
    await ctx.send(sentence)
      .then(() => console.log(succes_prefix, `#${ctx.chatId} Text generated (${Utils.getTimeString()})`))
  }
})

// Обработка возможных ошибок
process.on('uncaughtException', error => console.error(error_prefix, `Error: ${error.message}`))
process.on('unhandledRejection', error => console.error(error_prefix, `Error: ${error.message}`))