import { useState } from "react";
import { useParams } from "react-router-dom";

import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepDesign from "./steps/StepDesign";
import StepContent from "./steps/StepContent";
import StepExtra from "./steps/StepExtra";
import StepReview from "./steps/StepReview";

const STEPS = ["business", "design", "content", "extra", "review"] as const;

export default function OrderSetupPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [stepIndex, setStepIndex] = useState(0);

  if (!orderId) {
    return <p>Order non valido</p>;
  }

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  switch (STEPS[stepIndex]) {
    case "business":
      return <StepBusinessInfo onNext={next} />;

    case "design":
      return <StepDesign onNext={next} onBack={back} />;

    case "content":
      return <StepContent onNext={next} onBack={back} />;

    case "extra":
      return <StepExtra onNext={next} onBack={back} />;

    case "review":
      return <StepReview orderId={orderId} onBack={back} />;

    default:
      return null;
  }
}
