import { AuthUI } from '@/components/auth/AuthUI';

export default function Signup() {
  const signUpContent = {
    image: {
      src: "https://i.ibb.co/HTZ6DPsS/original-33b8479c324a5448d6145b3cad7c51e7-removebg-preview.png",
      alt: "User Signup"
    },
    quote: {
      text: "Join thousands of users accessing gazette information.",
      author: "govgazette"
    }
  };

  return <AuthUI signUpContent={signUpContent} />;
}