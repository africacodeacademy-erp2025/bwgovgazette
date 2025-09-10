import { AuthUI } from '@/components/auth/AuthUI';

export default function AdminSignup() {
  const signUpContent = {
    image: {
      src: "https://i.ibb.co/HTZ6DPsS/original-33b8479c324a5448d6145b3cad7c51e7-removebg-preview.png",
      alt: "Admin Signup"
    },
    quote: {
      text: "Join the administrative team.",
      author: "govgazette Admin"
    }
  };

  return <AuthUI signUpContent={signUpContent} />;
}