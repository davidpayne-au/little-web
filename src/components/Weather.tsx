import React from "react";
import type { LocationCandidate, WeatherResponse } from "../api/weather";
import { getWeatherCondition } from "../weatherConditions";

const Weather = ({ data, location }: { data: WeatherResponse; location: LocationCandidate }) => {
	const temperature = data.current?.temperature_2m ?? data.current_weather?.temperature;
	const humidity = data.current?.relative_humidity_2m;
	const windSpeed = data.current?.wind_speed_10m ?? data.current_weather?.wind_speed;
	const weatherCode = data.current?.weather_code ?? data.current_weather?.weathercode;
	const isDay = data.current?.is_day ?? data.current_weather?.is_day;
	const uvIndex = data.daily?.uv_index_max?.[0];
	const condition = getWeatherCondition(weatherCode, isDay);

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
							{typeof temperature === "number" ? `${temperature.toFixed(1)}°` : "N/A"}
						</p>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-2 gap-3">
					<div className="rounded-md border border-blue-200 bg-white/70 p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900/70 dark:text-gray-200">
						<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Condition</p>
						<p>{condition.label}</p>
					</div>
					{typeof humidity === "number" && (
						<div className="rounded-md border border-blue-200 bg-white/70 p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900/70 dark:text-gray-200">
							<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Humidity</p>
							<p>{humidity}%</p>
						</div>
					)}
					{typeof windSpeed === "number" && (
						<div className="rounded-md border border-blue-200 bg-white/70 p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900/70 dark:text-gray-200">
							<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Wind Speed</p>
							<p>{windSpeed.toFixed(1)} km/h</p>
						</div>
					)}
					{typeof uvIndex === "number" && (
						<div className="rounded-md border border-blue-200 bg-white/70 p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900/70 dark:text-gray-200">
							<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">UV Index</p>
							<p>{uvIndex.toFixed(1)}</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Weather;
