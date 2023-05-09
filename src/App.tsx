import MultiplePointsSVG from './components/sections/MultiplePointsSVG'
import SinglePointCanvas from './components/sections/SinglePointCanvas'
import './App.css'
import SplineAroundPoints from './components/sections/SplineAroundPoints'
import FullExample1 from './components/sections/FullExample1'

function App() {
  return (
    <>
      <section>
        <SinglePointCanvas />
      </section>
      <section>
        <MultiplePointsSVG />
      </section>
      <section>
        <SplineAroundPoints />
      </section>
      <section>
        <FullExample1 />
      </section>
    </>
  )
}

export default App
