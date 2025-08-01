import { useForm } from "@tanstack/react-form";
import {
	QueryClient,
	QueryClientProvider,
	useMutation,
} from "@tanstack/react-query";
import { BadgeCheck, CloudAlert, Languages } from "lucide-react";
import { createRoot } from "react-dom/client";
import { toast } from "sonner";
import { LANGUAGE_EMOJI_MAP, LANGUAGE_NAME_MAP } from "../constants/languages";
import { LANGUAGE_DETECTION_ROUTE } from "../constants/routeNames";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./components/ui/card";
import { Toaster } from "./components/ui/sonner";
import { Textarea } from "./components/ui/textarea";

async function detectLanguage(text: string) {
	try {
		const res = await fetch(`/${LANGUAGE_DETECTION_ROUTE}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
		});
		if (!res.ok) {
			const statusText = res.statusText;
			throw new Error(`HTTP ${res.status}: ${statusText}`);
		}
		const data = await res.json();
		if (data.languageCode) {
			return { languageCode: data.languageCode as string, input: text };
		} else {
			throw new Error(data.error || "Unknown error");
		}
	} catch (err) {
		let message = "Network error";
		if (err instanceof Error && err.message) {
			message = err.message;
		}
		throw new Error(message);
	}
}

function App() {
	const mutation = useMutation({
		mutationFn: detectLanguage,
		onError: (error) => {
			toast("SERVER ERROR!", {
				description: error.message,
				icon: <CloudAlert size={18} strokeWidth={2.5} />,
				action: {
					label: "Reset",
					onClick: () => {
						form.reset();
					},
				},
			});
		},
	});
	const { mutate, isPending, isSuccess, data } = mutation;
	const form = useForm({
		defaultValues: { text: "" },
		onSubmit: async ({ value }) => {
			mutate(value.text.trim());
		},
	});

	return (
		<>
			<div className="max-w-md mx-auto mt-8 font-sans flex flex-col space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>
							<div className="flex items-center space-x-2">
								<Languages size={28} strokeWidth={2.5} />
								<div>Language Detector</div>
							</div>
						</CardTitle>
						<CardDescription>Detect the language of your text.</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit(e);
							}}
							className="space-y-4"
						>
							<form.Field name="text">
								{(field) => (
									<>
										<Textarea
											rows={4}
											value={field.state.value}
											onChange={(e) => field.setValue(e.target.value)}
											placeholder="Enter text to detect language..."
										/>
										<Button
											type="submit"
											disabled={isPending || !field.state.value.trim()}
											className="w-full mt-2"
										>
											{isPending || form.state.isSubmitting
												? "Detecting..."
												: "Detect Language"}
										</Button>
										{field.state.meta.errors.length > 0 && (
											<Alert variant="destructive">
												<AlertTitle>Heads up!</AlertTitle>
												<AlertDescription>
													{field.state.meta.errors[0]}
												</AlertDescription>
											</Alert>
										)}
									</>
								)}
							</form.Field>
						</form>
					</CardContent>
				</Card>

				{isSuccess && data && (
					<Alert variant="default">
						<BadgeCheck size={28} strokeWidth={2.5} />
						<AlertTitle>
							{LANGUAGE_NAME_MAP[data.languageCode]
								? `This is ${LANGUAGE_NAME_MAP[data.languageCode]}! ${LANGUAGE_EMOJI_MAP[data.languageCode]}`
								: `Detected language code: ${data.languageCode}`}
						</AlertTitle>
						<AlertDescription>{`"${data.input}"`}</AlertDescription>
					</Alert>
				)}
			</div>
			<Toaster position="bottom-center" />
		</>
	);
}

const queryClient = new QueryClient();
const container = document.getElementById("root");
if (!container) {
	throw new Error('Root container element with id "root" not found');
}
const root = createRoot(container);
root.render(
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>,
);
