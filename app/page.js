import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";
import QuizApp from "@/components/QuizApp";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black text-green-400 transition-colors duration-300">
        <ThemeToggle />
        <Hero />
        <Features />
        <QuizApp />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
