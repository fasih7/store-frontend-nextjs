import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTPForm } from "../forms/input-otp-form";

interface OTPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOptSubmit: (optValue: string) => void;
  onResendOTP: () => void;
  timer: number; // <- managed by parent---**-
  errorMessage?: string;
}

export function OTPModal({
  open,
  onOpenChange,
  onOptSubmit,
  onResendOTP,
  timer,
  errorMessage,
}: Readonly<OTPModalProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center space-y-4 p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">Enter OTP</DialogTitle>
        </DialogHeader>

        <InputOTPForm
          onSuccess={onOptSubmit}
          resendProps={{ onResendOTP, timer }}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  );
}
