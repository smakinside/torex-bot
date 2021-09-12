/** __   __   __  ___  ___         __   __  ___
 * /  ' /  \ |__)  |  |__  \_/    |__) /  \  |
 * \__. \__/ |  \  |  |___ / \    |__) \__/  |
 *
 * @copyright © 2021 hepller
 */

/** Функции */
module.exports = class Utils {

  /** Получает текущее время в формате `hh:mm:ss` */
  static getTimeString() {

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

  /**
   * Возвращает `true` с определенным шансом
   * @param {number} likelihood Вероятность (%)
   */
  static getWithChance(likelihood) {
    return Math.random() * 100 < likelihood
  }

  /**
   * Форматирует текст (устанавливает заглавную букву и точку в конце)
   * @param {string} text Текст для форматирования
   */
  static formatText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1) + '.'
  }
}