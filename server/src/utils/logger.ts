export const logger = {
  info: (msg: string, ...args: any[]) => log('INFO', msg, ...args),
  warn: (msg: string, ...args: any[]) => log('WARN', msg, ...args),
  error: (msg: string, ...args: any[]) => log('ERROR', msg, ...args),
  debug: (msg: string, ...args: any[]) => log('DEBUG', msg, ...args),
};

function log(level: string, msg: string, ...args: any[]) {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  console.log(`[${time}] [${level}] ${msg}`, ...args);
}
