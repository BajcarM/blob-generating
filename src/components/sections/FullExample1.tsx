import BlobSvg from '../BlobSvg'

export default function FullExample1() {
  return (
    <>
      <h2>Example with working svg component </h2>
      <BlobSvg
        shape="rect"
        innerBoxWidth={300}
        innerBoxHeight={200}
        movementSpace={0.5}
        minSpaceBetweenPoints={100}
        tension={1.5}
        speed={0.005}
      />
    </>
  )
}
