import { UpdatePasswordForm, Typewriter } from '@/components/auth/AuthUI';

const updatePasswordContent = {
    image: {
        src: "https://i.ibb.co/yBf4N5g/original-a89e18241a8128913957a9884b257525-removebg-preview.png",
        alt: "A secure lock symbolizing a new password"
    },
    quote: {
        text: "A new key, a new beginning. Secure your account.",
        author: "EaseMize UI"
    }
};

export default function UpdatePasswordPage() {
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
            <UpdatePasswordForm />
        </div>
      </div>

      <div
        className="hidden md:block relative bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${updatePasswordContent.image.src})` }}
        key={updatePasswordContent.image.src}
      >

        <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-end p-2 pb-6">
            <blockquote className="space-y-2 text-center text-foreground">
              <p className="text-lg font-medium">
                "<Typewriter
                    key={updatePasswordContent.quote.text}
                    text={updatePasswordContent.quote.text}
                    speed={60}
                  />"
              </p>
              <cite className="block text-sm font-light text-muted-foreground not-italic">
                  — {updatePasswordContent.quote.author}
              </cite>
            </blockquote>
        </div>
      </div>
    </div>
  );
}
