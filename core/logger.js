/** __  __   __  ___  ___
 * /   /  \ |__)  |  |__  \_/
 * \__ \__/ |  \  |  |___ / \
 *
 * @copyright © 2021-2022 hepller
 */

// Импорт компонентов ядра
import Utils from './utils.js'

/** Логер */
export default class Logger {

  /**
   * Выводит в лог информацию
   * @param {string} text Текст сообщения
   */
  static info(text) {
    console.log(`[${Utils.getTimeString()} INFO]: ${text}`.replace(/\n/g, '\\n'))
  }

  /**
   * Выводит в лог предупреждения
   * @param {string} text Текст предупреждения
   */
  static warn(text) {
    console.log(`\u001B[33m[${Utils.getTimeString()} WARN]: ${text}\u001B[0m`)
  }

  /**
   * Выводит в лог ошибки
   * @param {string} text Текст ошибки
   */
  static error(text) {
    console.log(`\u001B[31m[${Utils.getTimeString()} ERRO]: ${text}\u001B[0m`)
  }
}