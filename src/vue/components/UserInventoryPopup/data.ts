export const inventory = Array.from({ length: 5 }, (_, index) => (  {
  id: index,
  type: 'inventory',
  title: 'Title',
  description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste, odio.',
  image: '/gui/images/starBackgroundDescription.png',
  icon: '/gui/images/icons/laser-violet.png',
  count: 10 * (index + 1),
}))

export const events = [
  {
    id: 1,
    type: 'event',
    title: 'Title',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste, odio.',
    image: '/gui/images/starBackgroundDescription.png',
    icon: '/gui/images/icons/laser-violet.png',
    price: '1000',
  }
]
