import Header from "../Components/Header.jsx";
import HeroSection from "../Components/HeroSection.jsx";
import ChatWidget from "../ChatBot/ChatWidget.jsx"; // ۱. ایمپورت چت‌بات

function Home() {
  return (
    <div className="bg-porto-bg min-h-screen text-porto-fg transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
      </main>
      
      {/* ۲. اضافه کردن چت‌بات در پایین‌ترین قسمت */}
      <ChatWidget />
    </div>
  );
}

export default Home;