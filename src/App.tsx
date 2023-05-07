import MultiplePointsSVG from './components/MultiplePointsSVG'
import NoiseCanvas from './components/SinglePointCanvas'
import './App.css'

function App() {
  return (
    <>
      <section>
        <NoiseCanvas />
      </section>
      <section>
        <MultiplePointsSVG />
      </section>
    </>
  )
}

export default App
