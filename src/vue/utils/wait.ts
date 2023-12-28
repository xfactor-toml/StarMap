export const wait = (delay = 400) => new Promise<void>(resolve => setTimeout(resolve, delay))
