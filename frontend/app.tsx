import { useForm } from "@tanstack/react-form";
import {
	QueryClient,
	QueryClientProvider,
	useMutation,
} from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { LANGUAGE_DETECTION_ROUTE } from "../constants/routeNames";

async function detectLanguage(text: string) {
	try {
		const res = await fetch(`/prod/${LANGUAGE_DETECTION_ROUTE}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
		});
		if (!res.ok) {
			const statusText = res.statusText;
			throw new Error(`Error! HTTP ${res.status}: ${statusText}`);
		}
		const data = await res.json();
		if (data.languageCode) {
			return { languageCode: data.languageCode };
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
	});
	const { mutate, isPending, isSuccess, isError, data, error } = mutation;
	const form = useForm({
		defaultValues: { text: "" },
		onSubmit: async ({ value }) => {
			mutate(value.text);
		},
	});

	return (
		<div className="max-w-md mx-auto mt-8 font-sans">
			<h2 className="text-2xl font-bold mb-6 text-center">Language Detector</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit(e);
				}}
				className="space-y-4"
			>
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
								className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
								value={field.state.value}
								onChange={(e) => field.setValue(e.target.value)}
								placeholder="Enter text to detect language..."
							/>
							{field.state.meta.errors.length > 0 && (
								<div className="text-red-600 mt-1 text-sm">
									{field.state.meta.errors[0]}
								</div>
							)}
						</>
					)}
				</form.Field>
				<button
					type="submit"
					disabled={isPending || form.state.isSubmitted}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 mt-2"
				>
					{isPending || form.state.isSubmitting
						? "Detecting..."
						: "Detect Language"}
				</button>
			</form>
			{isSuccess && data?.languageCode && (
				<div className="mt-4 text-green-600 font-medium text-center">
					Detected language code: {data.languageCode}
				</div>
			)}
			{isError && (
				<div className="mt-4 text-red-600 text-center">{error.message}</div>
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
