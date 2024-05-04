import Info from "@/components/pages/account/info";
import Banner from "@/components/pages/account/banner";

const UserPage = () => {
  return (
    <div className="w-full h-full max-w-[1250px] flex flex-col items-center">
      {/* Banner */}
      <Banner />

      {/* Info */}
      <Info />
    </div>
  );
};

export default UserPage;
