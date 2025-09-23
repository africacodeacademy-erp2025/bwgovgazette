import { ForgotPasswordForm, Typewriter } from '@/components/auth/AuthUI';

const forgotPasswordContent = {
    image: {
        src: "https://i.ibb.co/pP2pWp2/original-b472e3535bf0c6a512702434a36d2962-removebg-preview.png",
        alt: "A person looking at a crossroads, symbolizing choice and recovery"
    },
    quote: {
        text: "Sometimes we forget, but every path can lead back home.",
        author: "EaseMize UI"
    }
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full min-h-screen md:grid md:grid-cols-2">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>
      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12">
        <div className="mx-auto grid w-[350px] gap-2">
            <ForgotPasswordForm />
        </div>
      </div>

      <div
        className="hidden md:block relative bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${forgotPasswordContent.image.src})` }}
        key={forgotPasswordContent.image.src}
      >

        <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-end p-2 pb-6">
            <blockquote className="space-y-2 text-center text-foreground">
              <p className="text-lg font-medium">
                "<Typewriter
                    key={forgotPasswordContent.quote.text}
                    text={forgotPasswordContent.quote.text}
                    speed={60}
                  />"
              </p>
              <cite className="block text-sm font-light text-muted-foreground not-italic">
                  — {forgotPasswordContent.quote.author}
              </cite>
            </blockquote>
        </div>
      </div>
    </div>
  );
}
