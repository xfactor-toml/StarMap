// ms -> 00:00
export const formatDuration = (duration: number): string => {
  const minutes = Math.trunc(duration / 1000 / 60)
  const seconds = Math.trunc(duration / 1000 - (minutes * 60))
  const fill = (number: number) => String(number).padStart(2, '0')

  return `${fill(minutes)}:${fill(seconds)}`
}
