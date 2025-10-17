
import Body from './Body'
import HeroSection from './HeroSection'
import NavBar from './NavBar'

const HomePage = () => {
  return (
    <div>
      <NavBar/>
      <HeroSection/>
   
      <section id="book-categories" className="mt-20">
  <Body/>

</section>

    </div>
  )
}

export default HomePage
