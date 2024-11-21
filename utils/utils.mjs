import { createLogger, format, transports } from 'winston'
import chalk from 'chalk'

// Crear un logger personalizado
export const logger = createLogger({
  level: 'info', // Nivel mínimo de log (puede ser 'error', 'warn', 'info', etc.)
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Agregar timestamp
    format.printf(({ level, message, timestamp, stack }) => {
      // Personalizar formato con colores
      const colors = {
        error: chalk.red.bold,
        warn: chalk.yellow,
        info: chalk.blue,
        debug: chalk.green
      }

      const colorize = colors[level] || chalk.white // Usar blanco si no hay color definido
      return `${chalk.gray(`[${timestamp}]`)} ${colorize(level.toUpperCase())}: ${stack || message}`
    })
  ),
  transports: [
    new transports.Console() // Enviar logs a la consola
  ]
})
