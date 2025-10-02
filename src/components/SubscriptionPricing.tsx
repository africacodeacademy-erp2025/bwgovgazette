import { useStripe } from '@/hooks/useStripe';
import { PricingCards, type PricingTier } from "@/components/ui/pricing-cards";

interface SubscriptionPricingProps {
  onSelectFree?: () => void;
  onSelectPaid?: () => void;
}

export default function SubscriptionPricing({ onSelectFree, onSelectPaid }: SubscriptionPricingProps) {
  const { createCheckoutSession } = useStripe();

  const handleSubscribeClick = async (planType: string) => {
    await createCheckoutSession(planType);
  };

  const tiers: PricingTier[] = [
    {
      name: "Free",
      price: 0,
      interval: "/ month",
      description: "Stay on the free trial and explore basics.",
      features: [
        { name: "Basic gazette search", included: true },
        { name: "Limited notifications", included: true },
        { name: "Save a few items", included: true },
      ],
      cta: {
        text: "Continue with Free",
        onClick: onSelectFree,
      }
    },
    {
      name: "Subscriber",
      price: 29,
      interval: "/ month",
      description: "Unlock full access and priority alerts.",
      highlight: true,
      features: [
        { name: "Unlimited alerts", included: true },
        { name: "Advanced filters", included: true },
        { name: "Priority support", included: true },
      ],
      cta: {
        text: "Subscribe",
        onClick: onSelectPaid || (() => handleSubscribeClick('subscriber')),
      }
    },
    {
      name: "Pay Per Download",
      price: 5,
      interval: "/ download",
      description: "Pay only for what you need.",
      features: [
        { name: "Single gazette access", included: true },
        { name: "Instant download", included: true },
        { name: "No commitment", included: true },
      ],
      cta: {
        text: "Buy Now",
        onClick: () => handleSubscribeClick('pay-per-download'),
      }
    },
  ];

  return (
    <PricingCards
        tiers={tiers}
        className="gap-4"
        sectionClassName="py-8"
        containerClassName="py-6"
    />
  );
}