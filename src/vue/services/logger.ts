class Logger {
  enabled: boolean

  constructor() {
    if (location.search.includes('logger=on')) {
      localStorage.setItem('logger', 'on')
    }

    if (location.search.includes('logger=off')) {
      localStorage.deleteItem('logger')
    }
    
    this.enabled = localStorage.getItem('logger') === 'on'
  }

  log(message) {
    if (this.enabled) {
      console.log(`${this.timestamp}:`, message)
    }
  }

  get timestamp() {
    return (new Date()).toLocaleTimeString()
  }
}

export const logger = new Logger()
