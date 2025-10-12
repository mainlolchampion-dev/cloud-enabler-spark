import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradePromptProps {
  feature: string;
  requiredPlan: "plus" | "premium";
  description?: string;
}

const PLAN_INFO = {
  plus: {
    name: "Plus",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  premium: {
    name: "Premium",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
};

export function UpgradePrompt({ feature, requiredPlan, description }: UpgradePromptProps) {
  const navigate = useNavigate();
  const planInfo = PLAN_INFO[requiredPlan];

  return (
    <Card className={`${planInfo.borderColor} border-2`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${planInfo.bgColor}`}>
            <Lock className={`w-5 h-5 ${planInfo.color}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{feature}</CardTitle>
            <CardDescription>
              Απαιτείται πλάνο {planInfo.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {description || `Το feature "${feature}" είναι διαθέσιμο μόνο στο πλάνο ${planInfo.name} και άνω.`}
        </p>
        <Button 
          onClick={() => navigate("/pricing")} 
          className="w-full"
          size="lg"
        >
          <Crown className="w-4 h-4 mr-2" />
          Αναβάθμιση σε {planInfo.name}
        </Button>
      </CardContent>
    </Card>
  );
}