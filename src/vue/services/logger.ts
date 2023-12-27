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

  _log(type: 'log' | 'error', message) {
    if (this.enabled) {
      console[type](`${this.timestamp}:`, message)
    }
  }

  log(message) {
    this._log('log', message)
  }
  
  error(message) {
    this._log('error', message)
  }

  get timestamp() {
    return (new Date()).toLocaleTimeString()
  }
}

export const logger = new Logger()
