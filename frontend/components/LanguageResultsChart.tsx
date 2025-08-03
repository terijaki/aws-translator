"use client";

import { useQuery } from "@tanstack/react-query";
import { CloudAlert } from "lucide-react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { LANGUAGE_DETECTION_RESULTS_ROUTE } from "../../constants/cdkNames";
import { LANGUAGE_COLOR_MAP, LANGUAGE_EMOJI_MAP, LANGUAGE_NAME_MAP } from "../../constants/languages";
import { Skeleton } from "./ui/skeleton";

export const description = "A mixed bar chart";

// Generate chartConfig dynamically from languageResults
function getChartConfig(languageResults: { code: string }[] | undefined): ChartConfig {
	if (!languageResults) return {};
	const config: ChartConfig = {};
	languageResults.forEach((item) => {
		config[item.code] = {
			label: LANGUAGE_NAME_MAP[item.code as keyof typeof LANGUAGE_NAME_MAP] || item.code,
			color: LANGUAGE_COLOR_MAP[item.code as keyof typeof LANGUAGE_COLOR_MAP] || "var(--chart-1)",
		};
	});
	return config;
}

export const languageResultsQueryKey = ["languageResults"];
async function fetchLanguageResults() {
	try {
		const res = await fetch(`/${LANGUAGE_DETECTION_RESULTS_ROUTE}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		if (!res.ok) {
			const statusText = res.statusText;
			throw new Error(`HTTP ${res.status}: ${statusText}`);
		}
		const data: { code: string; count: number }[] = await res.json();
		return data;
	} catch (err) {
		let message = "Network error";
		if (err instanceof Error && err.message) {
			message = err.message;
		}
		if (process.env.NODE_ENV === "development") {
			return [
				{ code: "kk", count: 10 },
				{ code: "de", count: 8 },
				{ code: "it", count: 4 },
				{ code: "nl", count: 2 },
				{ code: "en", count: 1 },
				// { code: "ja", count: 1 },
			];
		}
		throw new Error(message);
	}
}

export function LanguageResultsChart() {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: languageResultsQueryKey,
		queryFn: fetchLanguageResults,
	});

	if (isError) {
		toast("Error loading language results", {
			id: "languageResultsError",
			description: error.message,
			icon: <CloudAlert size={18} strokeWidth={2.5} />,
			richColors: true,
			duration: 10000,
			onAutoClose: () => {
				toast.dismiss("languageResultsError");
			},
			style: {
				color: "red",
			},
		});
		return null;
	}

	const chartConfig = getChartConfig(data);

	return (
		<div className="max-w-lg min-w-full md:min-w-md flex flex-col space-y-4 mx-auto lg:ms-0">
			{isLoading ? (
				<Skeleton className="h-18 lg:h-72 w-full bg-neutral-300" />
			) : (
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle>Language Results</CardTitle>
						<CardDescription>From the past 30 days</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfig}>
							<BarChart
								accessibilityLayer
								data={data}
								layout="vertical"
								margin={{
									left: 0,
								}}
							>
								<YAxis
									dataKey="code"
									type="category"
									tickLine={false}
									tickMargin={6}
									axisLine={false}
									tick={{ fontSize: 20 }}
									tickFormatter={(value) => LANGUAGE_EMOJI_MAP[value as keyof typeof LANGUAGE_EMOJI_MAP] || "🤔"}
								/>
								<XAxis dataKey="count" type="number" hide />
								<Bar dataKey="count" layout="vertical" radius={6} barSize={24}>
									{Array.isArray(data) && data.map((entry) => <Cell key={entry.code} fill={chartConfig[entry.code]?.color || "oklch(65% 0.75 252)"} />)}
								</Bar>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
