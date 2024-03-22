import { XCircle } from "lucide-react";

type FormErrorsProps = {
  errors: string[];
};

export const FormErrors = ({ errors }: FormErrorsProps) => {
  return (
    <div className="mt-0.5 text-xs text-rose-500 space-y-1">
      {errors.map((err: string, index) => (
        <div className="flex items-center font-medium" key={index}>
          <XCircle className="h-3 w-3 mr-1" /> {err}
        </div>
      ))}
    </div>
  );
};
