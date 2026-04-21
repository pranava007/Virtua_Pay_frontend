import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to VirtuaPay 💳</h1>
        <p className="mt-2 text-gray-500">
          Payment Gateway System
        </p>
      </main>

      <Footer />

    </div>
  );
};

export default HomePage;