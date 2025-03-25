import { RegisterForm } from "@/components/register-form";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
