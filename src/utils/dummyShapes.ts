import { Point, SpringShape, Spring } from '../types'

export const DUMMY_POINTS: Point[] = [
  {
    position: [300, 300],
    origin: [300, 300],
    velocity: [0, 0],
    mass: 1,
    forces: [],
    controlled: true,
  },
  {
    position: [550, 300],
    origin: [550, 300],
    velocity: [0, 0],
    mass: 0.5,
    forces: [],
    controlled: false,
  },
]

export const DUMMY_SPRINGS: Spring[] = [
  {
    point1: 0,
    point2: 1,
    stiffness: 0.5,
    restLength: 100,
  },
]

export const springShape2Points: SpringShape = {
  points: [
    {
      position: [300, 300],
      origin: [300, 300],
      velocity: [0, 0],
      mass: 1,
      forces: [],
      controlled: true,
    },
    {
      position: [550, 300],
      origin: [550, 300],
      velocity: [0, 0],
      mass: 10,
      forces: [],
      controlled: false,
    },
  ],
  springs: [
    {
      point1: 0,
      point2: 1,
      stiffness: 0.1,
      restLength: 0,
    },
  ],
}
