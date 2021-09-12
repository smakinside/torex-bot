/** __   __   __  ___  ___         __   __  ___
 * /  ' /  \ |__)  |  |__  \_/    |__) /  \  |
 * \__. \__/ |  \  |  |___ / \    |__) \__/  |
 *
 * @copyright © 2021 hepller
 */

// Импорт модулей
const {VK} = require('vk-io')
const Markov = require('markov-generator')

// Импорт функций
const Utils = require('./utils.js')

// Конфиг, паттерн и файл проекта
const config = require('./config')
const data = require('./data')
const project = require('./package')

// Инициализация vk-io
const vk = new VK({token: config.token, v: 5.131})

// Сообщения при запуске
console.log(`Cortex Bot v${project.version}`)
console.log('VK API connection ...')

// Запуск обработчика событий ВК
vk.updates.startPolling()
  .then(() => console.log('Successfully connected'))

// Обработчик сообщений ВК
vk.updates.on('message_new', async ctx => {

  // Игнорирование лишних сообщений
  if (!ctx.isChat || ctx.isOutbox || ctx.isGroup) return

  // Генерация сообщения с определенным шансом
  if (Utils.getWithChance(config.chance)) {

    // Сообщение в консоль о начале генеарции
    console.log(`Generation started <#${ctx.chatId}> ${Utils.getTimeString()}`)

    // Статус набора текста
    await ctx.setActivity()

    // Время в начале генерации
    const start_time = Date.now()

    // Генерация текста
    const sentence = new Markov({input: data, minLenght: config.min_words}).makeChain()

    // Предупреждение при превышении лимита символов
    if (sentence.split('').length > config.max_symbols) return console.log(`#${ctx.chatId} Symbols limit exceeded (${sentence.split('').length}/${config.max_symbols})`)

    // Время в конце генерации (преобразованное в милисекунды)
    const final_time = (Date.now() - start_time) % 1000

    // Отправка сообщения
    await ctx.send(config.format ? Utils.formatText(sentence) : sentence)
      .then(() => console.log(`Text generated <#${ctx.chatId}> ${final_time}ms`))
  }
})

// Обработка возможных ошибок
process.on('uncaughtException', error => console.error(`Error: ${error.message}`))
process.on('unhandledRejection', error => console.error(`Error: ${error.message}`))