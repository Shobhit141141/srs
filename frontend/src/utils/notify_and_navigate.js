import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useNotifyAndNavigate = () => {
  const router = useRouter();

  const notifyAndNavigate = (message, path) => {
    toast.success(message);
    router.push(path);
  };

  return notifyAndNavigate;
};
