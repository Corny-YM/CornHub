import Header from "@/components/header";

interface Props {
  children: React.ReactNode;
}

const UserLayout = ({ children }: Props) => {
  return (
    <div className="relative w-full h-full flex items-center">
      <Header />

      <div className="w-full h-full flex items-center justify-center relative pt-14">
        {children}
      </div>
    </div>
  );
};

export default UserLayout;
