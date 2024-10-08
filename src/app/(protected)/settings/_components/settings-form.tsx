import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UserRoleEnum} from "@/lib/db/schemas/auth";
import {Switch} from "@/components/ui/switch";
import {FormError} from "@/components/utils/form-error";
import {FormSuccess} from "@/components/utils/form-success";
import {Button} from "@/components/ui/button";
import {useCurrentUser} from "@/hooks/auth/use-current-user";
import {useEffect, useState, useTransition} from "react";
import {useSession} from "next-auth/react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {SettingsSchema} from "@/schemas/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {settings} from "@/actions/auth/settings";

export default function SettingsForm() {
    const user = useCurrentUser();
    const {status } = useSession()

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: user?.name ?? '',
            email: user?.email ?? '',
            isTwoFactorEnabled: user?.isTwoFactorEnabled ? 1 : 0,
        }
    });


    useEffect(() => {
        form.setValue('name', user?.name ?? '')
        form.setValue('email', user?.email ?? '')
        form.setValue('isTwoFactorEnabled', user?.isTwoFactorEnabled ? 1 : 0)
    }, [form, user])

    if(!user && status == "unauthenticated") location.replace('/settings')

    if(!user) return null

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        settings(values)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                }

                if (data.success) {
                    void update();
                    setSuccess(data.success);
                }
            })
            .catch(() => setError("Something went wrong!"));
    }

  return (
      <Form {...form}>
          <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
          >
              <div className="space-y-4">
                  <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                  <Input
                                      {...field}
                                      placeholder="John Doe"
                                      disabled={isPending}
                                  />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  {user?.isOAuth === false && (
                      <>
                          <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                          <Input
                                              {...field}
                                              placeholder="john.doe@example.com"
                                              type="email"
                                              disabled={isPending}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Password</FormLabel>
                                      <FormControl>
                                          <Input
                                              {...field}
                                              placeholder="******"
                                              type="password"
                                              disabled={isPending}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="newPassword"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>New Password</FormLabel>
                                      <FormControl>
                                          <Input
                                              {...field}
                                              placeholder="******"
                                              type="password"
                                              disabled={isPending}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </>
                  )}
                  {user?.isOAuth === false && (
                      <FormField
                          control={form.control}
                          name="isTwoFactorEnabled"
                          render={({ field }) => (
                              <FormItem className="">
                                  <div
                                      className={'flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm space-x-1'}>
                                      <div className="space-y-0.5">
                                          <FormLabel>Two Factor Authentication</FormLabel>
                                          <FormDescription>
                                              Enable two factor authentication for your account
                                          </FormDescription>
                                      </div>
                                      <FormControl>
                                          <Switch
                                              disabled={isPending}
                                              checked={!!field.value}
                                              onCheckedChange={val => field.onChange(val ? 1 : 0)}
                                          />
                                      </FormControl>
                                  </div>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  )}
              </div>
              <FormError message={error}/>
              <FormSuccess message={success}/>
              <Button
                  disabled={isPending}
                  type="submit"
                  className='w-full md:w-auto'
              >
                  Save
              </Button>
          </form>
      </Form>
  )
}
