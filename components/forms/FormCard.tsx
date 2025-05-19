import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface FormCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const FormCard = ({ children, title, description }: FormCardProps) => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  </div>
);

export default FormCard;
