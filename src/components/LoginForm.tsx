"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		const { email, password } = values;
		setIsLoading(true);
		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});
			if (result!.ok) {
				router.refresh();
			}
		} catch (error) {
			toast({
				title: "エラー",
				description: "ログインに失敗しました。",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full max-w-sm sm:max-w-md space-y-4 mx-auto px-4 sm:px-6"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm sm:text-base">
								Email
							</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="info@iotcloudsolutions.com"
									className={cn(
										"text-foreground text-sm sm:text-base",
										"h-9 sm:h-10",
										"px-3 sm:px-4"
									)}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm sm:text-base">
								Password
							</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="パスワード入力"
									className={cn(
										"text-foreground text-sm sm:text-base",
										"h-9 sm:h-10",
										"px-3 sm:px-4"
									)}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					disabled={isLoading}
					className={cn(
						"w-full sm:w-auto",
						"text-sm sm:text-base",
						"h-9 sm:h-10",
						"px-4 sm:px-6"
					)}
				>
					ログイン
				</Button>
			</form>
		</Form>
	);
}
