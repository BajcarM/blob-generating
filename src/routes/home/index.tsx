import { styled } from '@stitches/react'
import { BlobSvg } from '../../components/BlobSvg'
import underWaterJPG from '../../assets/images/underwater.jpg'
import underwaterWEBP from '../../assets/images/underwater.webp'

const Home = () => {
  return (
    <div className="containerS">
      <header>
        <h1>Welcome to Blob Generation Website</h1>
      </header>
      <BlobSeparator
        shape="rect"
        innerBoxHeight={5}
        innerBoxWidth={1100}
        movementRatio={0.3}
        minDistanceBetweenPoints={20}
        speed={0.01}
      />
      <main>
        <section>
          <h2>About Blob Generation</h2>
          <p>
            We specialize in Blob Generation, a fascinating technique that
            brings life and creativity to your designs. Our Blob Generation
            technology allows you to create unique and organic shapes that can
            add a touch of visual interest and playfulness to your projects.
          </p>
        </section>

        <section>
          <h2>Benefits of Blob Generation</h2>
          <ul>
            <li>
              <h3>Creative Freedom</h3>
              <p>
                Blob Generation gives you the freedom to create shapes that are
                not constrained by predefined geometries. Let your imagination
                run wild and bring your ideas to life with captivating blobs
                that are visually engaging and distinct.
              </p>
            </li>
            <li>
              <h3>Unique Visual Appeal</h3>
              <p>
                Blob shapes add a touch of uniqueness and visual appeal to your
                designs. They have a soft and organic feel that can evoke
                emotions, capture attention, and create a memorable user
                experience.
              </p>
            </li>
            <li>
              <h3>Versatility</h3>
              <p>
                Blob Generation is highly versatile and can be integrated into
                various design styles and contexts. Whether you're working on a
                playful and whimsical project or a modern and sleek design,
                blobs can be customized and adapted to suit your aesthetic
                preferences.
              </p>
            </li>
            <li>
              <h3>Dynamic and Interactive Elements</h3>
              <p>
                Blobs can be animated, morphed, and transformed to create
                dynamic and interactive elements. By adding movement and
                interactivity to blobs, you can enhance user engagement and
                create delightful experiences.
              </p>
            </li>
          </ul>
        </section>
        <ImageWrapper>
          <picture>
            <source srcSet={underwaterWEBP} />
            <StyledImage
              src={underWaterJPG}
              alt="Image underwater"
            />
          </picture>
          <BlobClippath
            shape="elipse"
            clipPathId="blobClippath"
            innerBoxHeight={500}
            innerBoxWidth={600}
          />
        </ImageWrapper>
        <section>
          <h2>Explore Blob Examples</h2>
          <p>
            Explore our website to discover a collection of inspiring blob
            examples and see how they can be applied in different design
            scenarios. Get inspired, experiment with Blob Generation, and
            elevate your design projects with captivating and eye-catching
            shapes.
          </p>
        </section>

        <section>
          <h2>Unleash Your Creativity</h2>
          <p>
            Ready to unleash your creativity? Dive into the world of Blob
            Generation and discover the endless possibilities it offers.
          </p>
          <p>
            Start exploring now and let your designs come to life with the magic
            of blobs!
          </p>
        </section>
      </main>
    </div>
  )
}

export default Home

const BlobSeparator = styled(BlobSvg, {
  margin: '0 auto',
  width: '100%',

  '& path': {
    fill: '#ff52584e',
    stroke: 'transparent',
    filter: 'drop-shadow(0 0 5px #ff5257)',
  },
})

const ImageWrapper = styled('div', {
  margin: '2rem auto',
  position: 'relative',
  maxWidth: 1100,
})

const StyledImage = styled('img', {
  width: '100%',
  height: 'auto',
  display: 'block',
  objectFit: 'cover',
  objectPosition: 'center',
  clipPath: 'url(#blobClippath)',
})

const BlobClippath = styled(BlobSvg, {
  height: 1,
  overflow: 'hidden',
  width: 1,
  position: 'absolute',
  margin: -1,
})
