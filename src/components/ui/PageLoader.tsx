import { Spinner } from "@/components/ui/spinner-1";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Spinner size={50} />
    </div>
  );
}