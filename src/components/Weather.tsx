import React from "react";
import type { LocationCandidate, WeatherResponse } from "../api/weather";
import { getWeatherCondition } from "../weatherConditions";

const Weather = ({ data, location }: { data: WeatherResponse; location: LocationCandidate }) => {
	const temperature = data.current_weather?.temperature;
	const weatherCode = data.current_weather?.weathercode;
	const condition = getWeatherCondition(weatherCode, data.current_weather?.is_day);

	return (
		<section aria-label="Weather data">
			<h2 className="mb-3 text-base font-semibold text-gray-800 dark:text-gray-200">Current weather</h2>
			<div className="rounded-xl border border-gray-200 bg-gradient-to-br from-sky-50 to-blue-50 p-5 shadow-sm dark:border-gray-700 dark:from-gray-900 dark:to-gray-950">
				<p className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">Location</p>
				<p className="text-lg font-bold text-gray-900 dark:text-gray-100">
					{location.name}
					{location.admin1 ? `, ${location.admin1}` : ""}
					{location.country ? `, ${location.country}` : ""}
				</p>

				<div className="mt-4 flex items-center gap-4">
					<div className="text-5xl" role="img" aria-label={condition.label}>
						{condition.emoji}
					</div>
					<div>
						<p className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
							Temperature
						</p>
						<p className="text-3xl font-black text-gray-900 dark:text-gray-100">
							{typeof temperature === "number" ? `${temperature.toFixed(1)}°C` : "N/A"}
						</p>
					</div>
				</div>

				<div className="mt-4 rounded-md border border-blue-200 bg-white/70 p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900/70 dark:text-gray-200">
					<p>
						<strong>Weather from API:</strong> {condition.label}
						{typeof weatherCode === "number" ? ` (code ${weatherCode})` : ""}
					</p>
				</div>
			</div>
		</section>
	);
};

export default Weather;
