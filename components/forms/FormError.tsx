import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface FormErrorProps {
  error: string | null;
}

const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null;

  const isSuccess = error.includes("successful");

  return (
    <Alert
      variant={isSuccess ? "default" : "destructive"}
      className={isSuccess ? "bg-green-50 text-green-800 border-green-200" : ""}
    >
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default FormError;
