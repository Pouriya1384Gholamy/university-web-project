import Header from "../Components/Header.jsx";
import HeroSection from "../Components/HeroSection.jsx";

function Home() {
  return (
    <div className="bg-porto-bg min-h-screen text-porto-fg transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}

export default Home;
