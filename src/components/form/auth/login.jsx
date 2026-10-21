"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useLoginUser from "@/hooks/auth/useLoginUser";
import { LOGIN_FORM_SCHEMA } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const Login = () => {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(LOGIN_FORM_SCHEMA),
    });

    const { mutate: loginUser, isLoading } = useLoginUser();

    const onSubmit = (data) => {
        loginUser(data, {
            onSuccess: () => {
                router.push("/dashboard");
                form.reset();
            },
        });
    };

    return (
        <div className="w-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup className="gap-2">
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    id={field.name}
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    id={field.name}
                                    type="password"
                                    enableShowPassword
                                    placeholder="Enter your password"
                                    autoComplete="password"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || isLoading}
                    className="w-full"
                >
                    {isLoading && <Spinner className="size-4" />}
                    {form.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    );
};

export default Login;
