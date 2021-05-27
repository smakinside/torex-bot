/** __   __   __  ___  ___
 * /  ' /  \ |__)  |  |__  \_/
 * \__, \__/ |  \  |  |___ / \
 * 
 * @copyright © 2021 hepller
 */

/** Получает текущее время */
const getTimeString = () => {

  // Переменные
  let hours = new Date().getHours()
  let minutes = new Date().getMinutes()
  let seconds = new Date().getSeconds()

  // Исправление одинарных символов
  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`
  if (seconds < 10) seconds = `0${seconds}`

  // Возвращение строки
  return `${hours}:${minutes}:${seconds}`
}

/** Логер */
export default class Logger {

  /**
   * Выводит в лог информацию
   * @param {string} text - Текст сообщения
   */
  static info(text) {
    console.log(`${getTimeString()} INFO - ${text}`.replace(/\n/g, '\\n'))
  }

  /**
   * Выводит в лог предупреждения
   * @param {string} text - Текст предупреждения
   */
  static warn(text) {
    console.log(`\u001B[33m${getTimeString()} WARN - ${text}\u001B[0m`)
  }

  /**
   * Выводит в лог ошибки
   * @param {string} text - Текст ошибки
   */
  static error(text) {
    console.log(`\u001B[31m${getTimeString()} ERRO - ${text}\u001B[0m`)
  }
}