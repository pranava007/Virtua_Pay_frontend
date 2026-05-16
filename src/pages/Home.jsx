import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import MerchantDashboard from "./MerchantDashboard";

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter italic">VirtuaPay <span className="text-yellow-500 underline decoration-4 underline-offset-8">v5.5</span></h1>
        <p className="mt-8 text-gray-500 text-xl font-medium max-w-xl">
          The industry standard for merchant-driven payment gateway infrastructure. Secure, rapid, and fully automated.
        </p>
      </div>
    );
  }

  return user.role === 'admin' ? <AdminDashboard /> : <MerchantDashboard />;
};

export default HomePage;