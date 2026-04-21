import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to VirtuaPay 💳
        </h1>

        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
          Secure and scalable multi-payment gateway system.  
          Integrate Razorpay, Stripe, PhonePe and more.
        </p>

        <div className="mt-6 flex gap-4">
          <a href="/login" className="bg-yellow-500 px-6 py-3 rounded-lg font-bold">
            Get Started
          </a>
          <a href="/register" className="border px-6 py-3 rounded-lg">
            Register
          </a>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default HomePage;