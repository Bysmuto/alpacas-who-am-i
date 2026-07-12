export const NAMES = [
   'DEREK', 'ELIANDRO', 'LUAN', 'MATHEUS',
  'MAURO', 'PEDRO', 'SATYRO', 'SEBASTIÃO', 'THIAGO',
]

const ROTATIONS = ['-rotate-2', 'rotate-1', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3']

export const rotationFor = (i) => ROTATIONS[i % ROTATIONS.length]
