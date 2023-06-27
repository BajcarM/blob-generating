import ContainerSection from '../../components/sections/ContainerSection'

import { WavesBackground } from '../../components/waveExamples/WavesBackground'
import { WavesBasic } from '../../components/waveExamples/WavesBasic'
import { WavesClip } from '../../components/waveExamples/WavesClip'
import { WavesDash } from '../../components/waveExamples/WavesDash'
import { WavesDivider } from '../../components/waveExamples/WavesDivider'
import { WavesFlow } from '../../components/waveExamples/WavesFlow'
import { WavesShadow } from '../../components/waveExamples/WavesShadow'

export const Waves = () => {
  return (
    <>
      <h1>Waves examples</h1>

      <ContainerSection>
        <WavesBasic />
        <WavesShadow />
        <WavesBackground />
        <WavesDivider />
        <WavesFlow />
        <WavesDash />
        <WavesClip />
      </ContainerSection>
    </>
  )
}
