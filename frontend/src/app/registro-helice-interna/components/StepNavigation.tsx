import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isNextDisabled = false,
  isLoading = false
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className="px-6"
      >
        Anterior
      </Button>

      <div className="text-sm text-gray-500">
        Guardado automáticamente
      </div>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isNextDisabled || isLoading}
          className="bg-red-600 hover:bg-red-700 px-6"
        >
          {isLoading ? 'Enviando...' : 'Enviar Registro'}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="bg-red-600 hover:bg-red-700 px-6"
        >
          Siguiente
        </Button>
      )}
    </div>
  );
}