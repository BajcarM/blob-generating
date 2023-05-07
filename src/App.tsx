import MultiplePointsSVG from './components/sections/MultiplePointsSVG'
import SinglePointCanvas from './components/sections/SinglePointCanvas'
import './App.css'
import SplineAroundPoints from './components/sections/SplineAroundPoints'

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
    </>
  )
}

export default App
