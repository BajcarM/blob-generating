export type Vector2D = [number, number]

export type Point = {
  position: Vector2D // Coordinates of the point
  mass: number // Mass of the point
  velocity: Vector2D // Velocity vector of the point
  forces: Vector2D[] // Array of force vectors applied to the point
  controlled: boolean // Indicates if the position of the point is controlled
}

export type Spring = {
  point1: number // Index of the first point in the points array
  point2: number // Index of the second point in the points array
  stiffness: number // Stiffness coefficient of the spring
  restLength: number // Rest length of the spring
}

export type SpringShape = {
  points: Point[]
  springs: Spring[]
}
