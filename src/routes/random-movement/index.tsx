import ContainerSection from '../../components/sections/ContainerSection'
import FullExample1 from '../../components/sections/FullExample1'
import MultiplePointsSVG from '../../components/sections/MultiplePointsSVG'
import SinglePointCanvas from '../../components/sections/SinglePointCanvas'
import SplineAroundPoints from '../../components/sections/SplineAroundPoints'

const RandomMovement = () => {
  return (
    <>
      <h1>Random Movement Generation</h1>
      <ContainerSection>
        <SinglePointCanvas />
      </ContainerSection>
      <ContainerSection>
        <MultiplePointsSVG />
      </ContainerSection>
      <ContainerSection>
        <SplineAroundPoints />
      </ContainerSection>
      <ContainerSection>
        <FullExample1 />
      </ContainerSection>
    </>
  )
}

export default RandomMovement
