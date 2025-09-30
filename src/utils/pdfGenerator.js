// Утилита для генерации PDF с результатами конвертации валют
// Использует jsPDF для создания PDF файлов

import { jsPDF } from 'jspdf'

// Функция для генерации PDF с результатами конвертации
export const generateConversionPDF = (conversionData) => {
  try {
    // Создаем новый PDF документ
    const doc = new jsPDF()
    
    // Настройки стилей
    const titleFontSize = 20
    const headingFontSize = 16
    const textFontSize = 12
    const smallTextFontSize = 10
    
    // Цвета
    const primaryColor = [33, 150, 243] // Синий
    const secondaryColor = [76, 175, 80] // Зеленый
    const textColor = [33, 33, 33] // Темно-серый
    
    let yPosition = 20
    
    // Заголовок
    doc.setFontSize(titleFontSize)
    doc.setTextColor(...primaryColor)
    doc.text('💱 Результат конвертации валют', 20, yPosition)
    yPosition += 20
    
    // Дата и время
    doc.setFontSize(smallTextFontSize)
    doc.setTextColor(...textColor)
    const currentDate = new Date().toLocaleString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    doc.text(`Дата создания: ${currentDate}`, 20, yPosition)
    yPosition += 15
    
    // Линия разделитель
    doc.setDrawColor(...primaryColor)
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 15
    
    // Основной результат конвертации
    doc.setFontSize(headingFontSize)
    doc.setTextColor(...primaryColor)
    doc.text('📊 Результат конвертации:', 20, yPosition)
    yPosition += 15
    
    // Исходная сумма
    doc.setFontSize(textFontSize)
    doc.setTextColor(...textColor)
    doc.text(`Исходная сумма: ${conversionData.fromAmount} ${conversionData.fromCurrency}`, 30, yPosition)
    yPosition += 10
    
    // Конвертированная сумма
    doc.setTextColor(...secondaryColor)
    doc.text(`Результат: ${conversionData.toAmount} ${conversionData.toCurrency}`, 30, yPosition)
    yPosition += 10
    
    // Курс обмена
    doc.setTextColor(...textColor)
    doc.text(`Курс: 1 ${conversionData.fromCurrency} = ${conversionData.exchangeRate} ${conversionData.toCurrency}`, 30, yPosition)
    yPosition += 20
    
    // Популярные курсы валют (если есть)
    if (conversionData.popularRates && conversionData.popularRates.length > 0) {
      doc.setFontSize(headingFontSize)
      doc.setTextColor(...primaryColor)
      doc.text('💰 Популярные курсы валют к рублю:', 20, yPosition)
      yPosition += 15
      
      conversionData.popularRates.forEach(rate => {
        doc.setFontSize(textFontSize)
        doc.setTextColor(...textColor)
        doc.text(`${rate.flag} ${rate.currency}: ${rate.rate} ₽`, 30, yPosition)
        yPosition += 8
      })
      yPosition += 10
    }
    
    // Информация об API
    if (conversionData.apiInfo) {
      yPosition += 10
      doc.setFontSize(headingFontSize)
      doc.setTextColor(...primaryColor)
      doc.text('🔄 Информация об обновлении курсов:', 20, yPosition)
      yPosition += 15
      
      doc.setFontSize(smallTextFontSize)
      doc.setTextColor(...textColor)
      doc.text(`Последнее обновление: ${conversionData.apiInfo.lastUpdate}`, 30, yPosition)
      yPosition += 8
      doc.text(`Следующее обновление через: ${conversionData.apiInfo.nextUpdate}`, 30, yPosition)
      yPosition += 8
      doc.text(`Статус API: ${conversionData.apiInfo.status}`, 30, yPosition)
      yPosition += 15
    }
    
    // Футер
    doc.setDrawColor(...primaryColor)
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 10
    
    doc.setFontSize(smallTextFontSize)
    doc.setTextColor(...textColor)
    doc.text('Создано с помощью Telegram конвертера валют', 20, yPosition)
    yPosition += 5
    doc.text('Все курсы валют получены через ExchangeRate API', 20, yPosition)
    
    return doc
    
  } catch (error) {
    console.error('Ошибка генерации PDF:', error)
    throw new Error('Не удалось создать PDF файл')
  }
}

// Функция для скачивания PDF файла
export const downloadPDF = (doc, filename = 'currency-conversion') => {
  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    const fullFilename = `${filename}_${timestamp}.pdf`
    doc.save(fullFilename)
    return fullFilename
  } catch (error) {
    console.error('Ошибка скачивания PDF:', error)
    throw new Error('Не удалось скачать PDF файл')
  }
}

// Основная функция для создания и скачивания PDF с результатами конвертации
export const createAndDownloadConversionPDF = async (conversionData) => {
  try {
    const doc = generateConversionPDF(conversionData)
    const filename = downloadPDF(doc, 'conversion-result')
    return {
      success: true,
      filename,
      message: 'PDF файл успешно создан и скачан'
    }
  } catch (error) {
    console.error('Ошибка создания PDF:', error)
    return {
      success: false,
      error: error.message,
      message: 'Не удалось создать PDF файл'
    }
  }
}

// Функция для проверки поддержки PDF в браузере
export const isPDFSupported = () => {
  try {
    return typeof jsPDF !== 'undefined'
  } catch (error) {
    return false
  }
}