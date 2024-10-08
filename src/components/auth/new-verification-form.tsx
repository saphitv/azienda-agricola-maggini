"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { newVerification } from "@/actions/auth/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/utils/form-error";
import { FormSuccess } from "@/components/utils/form-success";
import {Circle} from "lucide-react";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            })
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            title='🔐 Verification'
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <Circle className='animate-spin' />
                )}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    )
}
