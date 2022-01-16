/** __  __   __  ___  ___
 * /   /  \ |__)  |  |__  \_/
 * \__ \__/ |  \  |  |___ / \
 *
 * @copyright © 2021-2022 hepller
 * 2022 | forked by foammy
 */

// Импорт системных модулей
import { readFileSync, writeFileSync } from 'fs'

// Получение БД
const db = JSON.parse(readFileSync('data.json', 'utf8'))

/** Менеджер БД */
export default class DataManager {

  /**
   * Получает чат из БД
   * @param {number} chat_id ID чата
   */
   static getChat(chat_id) {

    // Поиск чата в БД
    let chat = db.chats.find(chat => chat.id == chat_id)

    // Добавление чата в БД при его отсутствии
    if (!chat) {

      // Добавление
      db.chats.push({id: chat_id, data: []})

      // Запись
      writeFileSync('data.json', JSON.stringify(db, null, '\t'))

      // Обновление значения переменной
      chat = db.chats.find(chat => chat.id == chat_id)
    }

    // Возвращение объекта чата
    return chat
  }

  /**
   * Записывает новые данные для чата
   * @param {number} chat_id ID чата
   * @param {string} data Данные
   */
  static writeChatData(chat_id, data) {

    // Добавление данных в БД
    DataManager.getChat(chat_id).data.push(data)
  
    // Запись БД
    writeFileSync('data.json', JSON.stringify(db, null, '\t'))
  }
}