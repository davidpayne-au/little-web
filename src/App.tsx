import React, { useEffect, useState, useCallback } from "react";
import { getWeather, searchLocations, type LocationCandidate, type WeatherResponse } from "./api/weather";
import Weather from "./components/Weather";

function getInitialTheme(): "dark" | "light" {
	if (typeof window === "undefined") return "light";
	const stored = localStorage.getItem("theme");
	if (stored === "dark" || stored === "light") return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialUnit(): "celsius" | "fahrenheit" {
	if (typeof window === "undefined") return "celsius";
	const stored = localStorage.getItem("temperatureUnit");
	if (stored === "celsius" || stored === "fahrenheit") return stored;
	return "celsius";
}

function getRecentSearches(): LocationCandidate[] {
	if (typeof window === "undefined") return [];
	const stored = localStorage.getItem("recentSearches");
	if (!stored) return [];
	try {
		return JSON.parse(stored);
	} catch {
		return [];
	}
}

function saveRecentSearch(location: LocationCandidate): void {
	if (typeof window === "undefined") return;
	const recent = getRecentSearches();
	const filtered = recent.filter((l) => l.id !== location.id);
	const updated = [location, ...filtered].slice(0, 5);
	localStorage.setItem("recentSearches", JSON.stringify(updated));
}

export default function App() {
	const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);
	const [unit, setUnit] = useState<"celsius" | "fahrenheit">(getInitialUnit);
	const [locationQuery, setLocationQuery] = useState("brisbane");
	const [candidates, setCandidates] = useState<LocationCandidate[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<LocationCandidate | null>(null);
	const [data, setData] = useState<WeatherResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [loadingLabel, setLoadingLabel] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [recentSearches, setRecentSearches] = useState<LocationCandidate[]>(getRecentSearches);
	const [geolocationError, setGeolocationError] = useState<string | null>(null);

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	useEffect(() => {
		localStorage.setItem("temperatureUnit", unit);
	}, [unit]);

	const toggleTheme = () => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));

	const toggleUnit = () => setUnit((currentUnit) => (currentUnit === "celsius" ? "fahrenheit" : "celsius"));

	const useGeolocation = useCallback(() => {
		if (!navigator.geolocation) {
			setGeolocationError("Geolocation is not supported by your browser");
			return;
		}

		setLoading(true);
		setLoadingLabel("Getting your location");
		setGeolocationError(null);

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;
				try {
					const res = await getWeather(latitude, longitude, unit);
					setData(res);
					setSelectedLocation({
						id: `${latitude}-${longitude}`,
						name: "Your Location",
						latitude,
						longitude,
					});
					setCandidates([]);
					setError(null);
				} catch (e: any) {
					setError(e.message || "Failed to fetch weather for your location");
				} finally {
					setLoadingLabel(null);
					setLoading(false);
				}
			},
			() => {
				setGeolocationError("Unable to access your location. Please enable location access.");
				setLoadingLabel(null);
				setLoading(false);
			}
		);
	}, [unit]);

	const fetchWeatherForLocation = async (location: LocationCandidate) => {
		setLoading(true);
		setLoadingLabel("Fetching weather");
		setError(null);
		setCandidates([]);
		setSelectedLocation(location);
		try {
			const res = await getWeather(location.latitude, location.longitude, unit);
			setData(res);
			saveRecentSearch(location);
			const updated = getRecentSearches();
			setRecentSearches(updated);
		} catch (e: any) {
			setError(e.message || "Failed to fetch weather data");
		} finally {
			setLoadingLabel(null);
			setLoading(false);
		}
	};

	const searchAndLoadWeather = async () => {
		if (!locationQuery.trim()) {
			setError("Enter a location name to search.");
			return;
		}

		setLoading(true);
		setLoadingLabel("Finding matching locations");
		setError(null);
		setData(null);
		setCandidates([]);
		setSelectedLocation(null);

		try {
			const matches = await searchLocations(locationQuery.trim());
			if (matches.length === 0) {
				setError("No matching locations were found. Try a more specific name.");
				return;
			}

			if (matches.length === 1) {
				await fetchWeatherForLocation(matches[0]);
				return;
			}

			setCandidates(matches);
		} catch (e: any) {
			setError(e.message || "Failed to search for locations");
		} finally {
			setLoadingLabel(null);
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
			<a
				href="#main-content"
				className="sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:not-sr-only focus:rounded focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-offset-2"
			>
				Skip to main content
			</a>

			<header className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
				<div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
					<h1 className="text-2xl font-bold tracking-tight">
						🌤️ Weather
						<span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-300">
							via Open-Meteo
						</span>
					</h1>
					<div className="flex items-center gap-2">
						<button
							onClick={toggleUnit}
							aria-label={unit === "celsius" ? "Switch to Fahrenheit" : "Switch to Celsius"}
							className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
							title={unit === "celsius" ? "°C" : "°F"}
						>
							<span aria-hidden="true">{unit === "celsius" ? "°C" : "°F"}</span>
						</button>
						<button
							onClick={toggleTheme}
							aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
							className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
						>
							{theme === "dark" ? (
								<span aria-hidden="true">☀️</span>
							) : (
								<span aria-hidden="true">🌙</span>
							)}
						</button>
					</div>
				</div>
			</header>

			<main id="main-content" className="mx-auto max-w-3xl px-6 py-8">
				<section aria-labelledby="location-heading">
					<h2 id="location-heading" className="mb-4 text-lg font-semibold">
						Enter a location name
					</h2>
					<div className="flex flex-wrap items-end gap-4">
						<div className="flex min-w-72 flex-1 flex-col gap-1">
							<label htmlFor="location-input" className="text-sm font-medium text-gray-800 dark:text-gray-200">
								Location name
							</label>
							<input
								id="location-input"
								type="text"
								value={locationQuery}
								onChange={(e) => setLocationQuery(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										void searchAndLoadWeather();
									}
								}}
								aria-describedby="location-hint"
								placeholder="e.g. brisbane"
								className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:ring-offset-gray-950"
							/>
							<span id="location-hint" className="sr-only">
								Enter a city or place name, then press Enter or Search
							</span>
						</div>

						<button
							onClick={searchAndLoadWeather}
							disabled={loading}
							aria-busy={loading}
							className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-gray-950"
						>
							{loading ? "Loading…" : "Search"}
						</button>

						<button
							onClick={useGeolocation}
							disabled={loading}
							aria-busy={loading}
							aria-label="Use your current location"
							className="rounded-md bg-green-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-800 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-gray-950"
						>
							📍
						</button>
					</div>

					{geolocationError && (
						<div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
							{geolocationError}
						</div>
					)}

					{candidates.length > 1 && !loading && (
						<div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
							<h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
								Choose a matching location
							</h3>
							<ul className="grid gap-2" role="listbox" aria-label="Matching locations">
								{candidates.map((candidate) => (
									<li key={candidate.id}>
										<button
											type="button"
											onClick={() => void fetchWeatherForLocation(candidate)}
											className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
										>
											{candidate.name}
											{candidate.admin1 ? `, ${candidate.admin1}` : ""}
											{candidate.country ? `, ${candidate.country}` : ""}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}

					{recentSearches.length > 0 && !data && candidates.length <= 1 && (
						<div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
							<h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
								Recent searches
							</h3>
							<div className="flex flex-wrap gap-2">
								{recentSearches.map((location) => (
									<button
										key={location.id}
										type="button"
										onClick={() => void fetchWeatherForLocation(location)}
										className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
									>
										{location.name}
									</button>
								))}
							</div>
						</div>
					)}
				</section>

				<div aria-live="polite" aria-atomic="true" className="mt-6 space-y-4">
					{error && (
						<div
							role="alert"
							className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-200"
						>
							<span aria-hidden="true" className="mt-0.5">
								⚠️
							</span>
							<span>{error}</span>
						</div>
					)}

					{loading && (
						<div role="status" className="loading-panel text-sm text-gray-700 dark:text-gray-300">
							<span className="sr-only">Loading weather data, please wait.</span>
							<div aria-hidden="true" className="loading-orbit" />
							<span aria-hidden="true" className="loading-emoji">
								🌤️
							</span>
							<span className="font-medium">{loadingLabel || "Loading"}…</span>
						</div>
					)}

					{data && !loading && selectedLocation && <Weather data={data} location={selectedLocation} />}
				</div>
			</main>
		</div>
	);
}
