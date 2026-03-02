import { AuthForm } from "@feature/auth/components/auth-form";

export default function AuthPage() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-6 flex flex-col gap-8">
                <h1 className="text-2xl font-bold">Authentication Page</h1>
                <AuthForm />
            </div>
        </div>
    );
}