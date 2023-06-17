import { FC } from 'react'
import ContainerSection from '../../components/sections/ContainerSection'
import Superellipse1 from '../../components/shapes/Superelipse1'
import Superellipse2 from '../../components/shapes/Superellipse2'
import { ExampleUseInCSS } from '../../components/shapes/ExampleUseInCSS'

export const Shapes: FC = () => {
  return (
    <div className="containerS">
      <h1>Superellipses: A Geometric Wonder</h1>{' '}
      <ContainerSection>
        <figure>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Superellipse.svg/1920px-Superellipse.svg.png"
            alt="Superellipses with different coefficients"
            height={400}
          />
          <figcaption>
            Image source:&nbsp;
            <a href="https://en.wikipedia.org/wiki/Superellipse">Wikipedia</a>
          </figcaption>
        </figure>
      </ContainerSection>
      <ContainerSection>
        <h2>What are Superellipses?</h2>
        <p>
          Superellipses, also known as Lamé curves or p-norm curves, are a class
          of geometric shapes that generalize both ellipses and rectangles. They
          were popularized by Danish mathematician Piet Hein and later studied
          by mathematician Gabriel Lamé.
        </p>
        <h2>The Formula</h2>
        <p>
          The equation of a superellipse in Cartesian coordinates is given by
          the following formula:
        </p>
        <p>
          <span className="math-equation">|x/a|^n + |y/b|^n = 1</span>
        </p>
        <p>
          Here, 'x' and 'y' are the coordinates of a point on the curve, 'a' and
          'b' are scaling factors that determine the size of the shape, and 'n'
          is a positive constant called the superellipse exponent. The value of
          'n' controls the shape of the superellipse.
        </p>
      </ContainerSection>
      <ContainerSection>
        <h2>Understanding the Shape</h2>
        <p>
          The superellipse exponent 'n' determines the curvature of the shape.
          When 'n' is less than 2, the superellipse has corners and straight
          edges similar to a rectangle. As 'n' increases, the corners become
          more rounded, resembling an ellipse. When 'n' is large, the
          superellipse approaches a circular shape.
        </p>
        <p>
          Superellipses offer a flexible way to generate a wide range of shapes,
          from angular to smooth, by simply adjusting the value of 'n'. They
          have found applications in various fields, including architecture,
          design, and computer graphics.
        </p>
      </ContainerSection>
      <ContainerSection>
        <h2>Superellipse Example simplified by using beziers</h2>
        <Superellipse1 />
      </ContainerSection>
      <ContainerSection>
        <h2>Superellipse to Points to Spline</h2>
        <p>
          To simulate spring physics and achieve smooth animation, we transform
          a superellipse into evenly spaced points. These points capture the
          shape's outline, which we animate to create dynamic movement. After
          animating the points, we draw a spline—a smooth curve that passes
          through the animated points. This spline representation ensures a
          visually pleasing and realistic motion in our spring animations.
        </p>
        <Superellipse2 />
      </ContainerSection>
      <ContainerSection>
        <ExampleUseInCSS />
      </ContainerSection>
    </div>
  )
}
