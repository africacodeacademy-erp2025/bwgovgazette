import { AuthUI } from '@/components/auth/AuthUI';

export default function AdminLogin() {
  const signInContent = {
    image: {
      src: "https://i.ibb.co/XrkdGrrv/original-ccdd6d6195fff2386a31b684b7abdd2e-removebg-preview.png",
      alt: "Admin Login"
    },
    quote: {
      text: "Access your administrative dashboard.",
      author: "govgazette Admin"
    }
  };

  return <AuthUI signInContent={signInContent} />;
}