"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {useState, useTransition} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";

import {LoginSchema} from "@/schemas/auth";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {CardWrapper} from "@/components/auth/card-wrapper"
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/utils/form-error";
import {FormSuccess} from "@/components/utils/form-success";
import {login} from "@/actions/auth/login";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            try {
                console.log(1, values, callbackUrl)
                const data = await login(values, callbackUrl)
                console.log(2, data)

                if (data?.error) {
                    form.resetField('code')
                    setError(data.error);
                    if (data.error == "Code expired!") {
                        setShowTwoFactor(false)
                    }
                }


                if (data?.success) {
                    form.reset();
                    setSuccess(data.success);
                    //router.push(data.redirect)
                }

                if (data?.twoFactor) {
                    setShowTwoFactor(true);
                }
            } catch (err) {
                console.error("Something went wrong")
                setError("Something went wrong")
            }
        });
    };

    return (
        <>
            <CardWrapper
                headerLabel="Bentornato/a"
                showSocial
                title={"🔐 Accedi"}
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3.5"
                    >
                        <div className="space-y-2">
                            {showTwoFactor && (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Codice due fattori</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0}/>
                                                        <InputOTPSlot index={1}/>
                                                        <InputOTPSlot index={2}/>
                                                        <InputOTPSlot index={3}/>
                                                        <InputOTPSlot index={4}/>
                                                        <InputOTPSlot index={5}/>
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription>
                                                Please enter the 2FA code sent to your email.
                                            </FormDescription>

                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!showTwoFactor && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="john.doe@example.com"
                                                        type="email"
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="******"
                                                        type="password"
                                                    />
                                                </FormControl>
                                                <Button
                                                    size="sm"
                                                    variant="link"
                                                    asChild
                                                    className="px-0 font-normal"
                                                >
                                                    <Link href="/reset">
                                                        Dimenticata la password?
                                                    </Link>
                                                </Button>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <FormError message={error || urlError}/>
                        <FormSuccess message={success}/>
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full"
                        >
                            {showTwoFactor ? "Conferma" : "Accedi"}
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </>
    );
};
