import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

interface Props {
  className?: string;
  description?: string;
}

const EmptyData = ({
  className,
  description = "Không tìm thấy dữ liệu",
}: Props) => {
  return (
    <div
      className={cn(
        "w-full flex justify-center items-center",
        "rounded-lg overflow-hidden px-4 py-2 bg-primary/20",
        "border border-solid border-neutral-400/50",
        className
      )}
    >
      <div className="flex justify-center items-center mr-3 text-primary">
        <CircleAlert />
      </div>
      <div>{description}</div>
    </div>
  );
};

export default EmptyData;
