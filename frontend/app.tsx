import { useForm } from "@tanstack/react-form";
import {
	QueryClient,
	QueryClientProvider,
	useMutation,
} from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { LANGUAGE_DETECTION_ROUTE } from "../constants/routeNames";

async function detectLanguage(text: string) {
	return fetch(`/prod/${LANGUAGE_DETECTION_ROUTE}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text }),
	}).then(async (res) => {
		const data = await res.json();
		if (res.ok && data.languageCode) {
			return { languageCode: data.languageCode };
		} else {
			throw new Error(data.error || "Unknown error");
		}
	});
}

function App() {
	const mutation = useMutation({
		mutationFn: detectLanguage,
	});
	const { mutate, isPending, isSuccess, isError, data, error } = mutation;
	const form = useForm({
		defaultValues: { text: "" },
		onSubmit: async ({ value }) => {
			mutate(value.text);
		},
	});

	return (
		<div
			style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}
		>
			<h2>Language Detector</h2>
			<form onSubmit={form.handleSubmit}>
				<form.Field
					name="text"
					validators={{
						onChange: ({ value }) =>
							!value.trim() ? "Text required" : undefined,
					}}
				>
					{(field) => (
						<>
							<textarea
								rows={4}
								style={{ width: "100%" }}
								value={field.state.value}
								onChange={(e) => field.setValue(e.target.value)}
								placeholder="Enter text to detect language..."
							/>
							{field.state.meta.errors.length > 0 && (
								<div style={{ color: "red", marginTop: 4 }}>
									{field.state.meta.errors[0]}
								</div>
							)}
						</>
					)}
				</form.Field>
				<button
					type="submit"
					disabled={isPending || form.state.isSubmitted}
					style={{ marginTop: 8 }}
				>
					{isPending || form.state.isSubmitting
						? "Detecting..."
						: "Detect Language"}
				</button>
			</form>
			{isSuccess && data?.languageCode && (
				<div style={{ marginTop: 16, color: "green" }}>
					Detected language code: {data.languageCode}
				</div>
			)}
			{isError && (
				<div style={{ marginTop: 16, color: "red" }}>{error.message}</div>
			)}
		</div>
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
