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
import useRegisterUser from "@/hooks/auth/useRegisterUser";
import { REGISTER_FORM_SCHEMA } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const Register = () => {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(REGISTER_FORM_SCHEMA),
    });

    const { mutate: registerUser, isLoading } = useRegisterUser();

    const onSubmit = (data) => {
        registerUser(data, {
            onSuccess: () => {
                router.push("/auth/welcome");
                form.reset();
            },
        });
    };

    return (
        <div className="w-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup className="gap-2">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Full name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    id={field.name}
                                    placeholder="Enter your name"
                                    autoComplete="name"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
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
                        name="mobile"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Mobile
                                </FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    id={field.name}
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    autoComplete="tel"
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
                    {form.formState.isSubmitting
                        ? "Creating..."
                        : "Create Account"}
                </Button>
            </form>
        </div>
    );
};

export default Register;
