import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";

interface FormFooterProps {
  children: React.ReactNode;
  isLoading: boolean;
  submitText: string;
  loadingText: string;
}

const FormFooter = ({
  children,
  isLoading,
  submitText,
  loadingText,
}: FormFooterProps) => (
  <CardFooter className="flex flex-col mt-4 space-y-4">
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? loadingText : submitText}
    </Button>
    <div className="text-center text-sm">{children}</div>
  </CardFooter>
);

export default FormFooter;
