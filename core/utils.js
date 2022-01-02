/** __  __   __  ___  ___
 * /   /  \ |__)  |  |__  \_/
 * \__ \__/ |  \  |  |___ / \
 *
 * @copyright © 2021-2022 hepller
 */

/** Функции */
export default class Utils {

  /** Возвращает строку со временем в формате `hh:mm:ss` */
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

    // Замена некорректных значений
    if (likelihood < 0) likelihood = 0
    if (likelihood > 100) likelihood = 100

    // Возвращение значения
    return Math.random() * 100 < likelihood
  }

  /**
   * Останавливает выполнение функции на указанное время
   * @param {number} ms Время остановки (в миллисекундах)
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static formatString(text) {
    return text.toLowerCase().charAt(0).toUpperCase() + text.slice(1) + '.'
  }
}