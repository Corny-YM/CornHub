import Header from "@/components/header";

interface Props {
  children: React.ReactNode;
}

const GroupLayout = ({ children }: Props) => {
  return (
    <div className="relative w-full flex items-center">
      <Header />

      <div className="w-full h-full flex items-center justify-center relative pt-14 overflow-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default GroupLayout;
