import { ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const displayToast = (content: string) => {
    toast.error(content, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: false,
    });
  };

  return (
    <div>
      {children}
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Layout;
