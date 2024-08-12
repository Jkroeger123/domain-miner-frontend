import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export default function Spinner({ className }: Props) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          `size-4 animate-spin rounded-full border-4 border-gray-300 border-t-gray-500`,
          className,
        )}
      />
    </div>
  );
}
