/** __  __   __  ___  ___
 * /   /  \ |__)  |  |__  \_/
 * \__ \__/ |  \  |  |___ / \
 *
 * @copyright © 2021-2022 hepller
 */

// Импорт зависимостей
import { VK } from 'vk-io'
import YAML from 'yaml'
import Markov from 'markov-generator'

// Импорт системных модулей
import { readFileSync } from 'fs'

// Импорт компонентов ядра
import Logger from './logger.js'
import Utils from './utils.js'
import DataManager from './data_manager.js'

// Парсинг конфигураций проекта
const config = YAML.parse(readFileSync('config.yml', 'utf8'))
const project = JSON.parse(readFileSync('package.json', 'utf8'))

// Инициализация vk-io
const vk = new VK(

  // Определение места работы бота (группа / страница)
  config.longpoll.group_id

    // При работе в группе
    ? {token: config.longpoll.token, v: config.longpoll.version, pollingGroupId: config.longpoll.group_id}

    // При работе на странице
    : {token: config.longpoll.token, v: config.longpoll.version}
)

// Сообщение о запуске
Logger.info(`Cortex Bot v${project.version} запущен`)

// Сообщение о подключении к VK API
Logger.info('Подключение к VK Long Poll ...')

// Старт получения событий ВК
vk.updates.startPolling().then(() => Logger.info('VK Long Poll подключен'))

// Обработчик сообщений ВК
vk.updates.on('message_new', async ctx => {

  // Игнорирование лишних сообщений
  if (!ctx.isChat || ctx.isOutbox) return
  if (config.messages.active_chats != 'all' && !config.messages.active_chats.includes(ctx.chatId)) return

  // Логирование сообщений
  Logger.info(`#${ctx.chatId} ${ctx.senderId} '->' ${ctx.text || '<no_text>'} ${ctx?.attachments}`)

  // Получение чата из БД
  ctx.chat = DataManager.getChat(ctx.chatId)

  // Запись сообщения в БД
  if (!ctx.isGroup && ctx.text && config.database.data_save && !ctx.chat.data.includes(ctx.text)) DataManager.writeChatData(ctx.chatId, ctx.text)

  // Генерация сообщения с определенным шансом
  if (Utils.getWithChance(config.messages.chance)) {

    // Сообщение в консоль о генерации текста
    Logger.info(`#${ctx.chatId} Генерация текста ...`)

    // Генерация текста
    // * Если данных будет недостаточно произойдет ошибка <<Maximum call stack size exceeded>>
    const sentence = new Markov({input: ctx.chat.data, minLength: config.generation.min_words}).makeChain()

    // Форматирование текста (если включено)
    const formatted_sentence = config.messages.format ? Utils.formatString(sentence) : sentence

    // Предупреждение при превышении лимита символов
    if (formatted_sentence.split('').length > config.messages.symbols_limit) return Logger.warn(`#${ctx.chatId} Превышен лимит символов (${formatted_sentence.split('').length}/${config.messages.symbols_limit})`)

    // Установка статуса набора текста
    ctx.setActivity()

    // Задержка перед отправкой сообщений для имитации написания (если включено)
    // * Высчитывается на основе количества символов в сгенерированном тексте
    if (config.messages.writing_imitation) await Utils.sleep(formatted_sentence.split('').length * 2 + '00')

    // Отправка сообщения
    ctx.send(formatted_sentence).then(() => Logger.info(`#${ctx.chatId} Сообщение сгенерировано ("${sentence}")`))
  }
})

// Логирование неперехваченных исключений
process.on('uncaughtException', error => Logger.error(error.stack))

// Логирование необработанных ошибок (promise error)
process.on('unhandledRejection', error => Logger.error(error.stack))