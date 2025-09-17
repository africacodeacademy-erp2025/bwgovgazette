import { AuthUI } from '@/components/auth/AuthUI';
import { LoginRedirect } from '@/components/LoginRedirect';

export default function Login() {
  const signInContent = {
    image: {
      src: "https://i.ibb.co/XrkdGrrv/original-ccdd6d6195fff2386a31b684b7abdd2e-removebg-preview.png",
      alt: "User Login"
    },
    quote: {
      text: "Welcome back to your dashboard.",
      author: "govgazette"
    }
  };

  return (
    <>
      <LoginRedirect />
      <AuthUI signInContent={signInContent} />
    </>
  );
}