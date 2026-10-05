import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Weather from "./Weather";
import type { WeatherResponse, LocationCandidate } from "../api/weather";

describe("Weather component", () => {
	const mockLocation: LocationCandidate = {
		id: "1",
		name: "Brisbane",
		country: "Australia",
		admin1: "Queensland",
		latitude: -27.47,
		longitude: 153.02,
	};

	it("renders location name with admin1 and country", () => {
		const mockData: WeatherResponse = {
			latitude: -27.47,
			longitude: 153.02,
			current: {
				temperature_2m: 25.5,
				weather_code: 0,
				is_day: 1,
			},
		};

		render(<Weather data={mockData} location={mockLocation} />);

		expect(screen.getByText(/Brisbane, Queensland, Australia/)).toBeInTheDocument();
	});

	it("displays temperature when available", () => {
		const mockData: WeatherResponse = {
			latitude: -27.47,
			longitude: 153.02,
			current: {
				temperature_2m: 25.5,
				weather_code: 0,
				is_day: 1,
			},
		};

		render(<Weather data={mockData} location={mockLocation} />);

		expect(screen.getByText(/25.5°/)).toBeInTheDocument();
	});

	it("displays humidity when available", () => {
		const mockData: WeatherResponse = {
			latitude: -27.47,
			longitude: 153.02,
			current: {
				temperature_2m: 25.5,
				relative_humidity_2m: 65,
				weather_code: 0,
				is_day: 1,
			},
		};

		render(<Weather data={mockData} location={mockLocation} />);

		expect(screen.getByText(/65%/)).toBeInTheDocument();
	});

	it("displays wind speed when available", () => {
		const mockData: WeatherResponse = {
			latitude: -27.47,
			longitude: 153.02,
			current: {
				temperature_2m: 25.5,
				wind_speed_10m: 12.5,
				weather_code: 0,
				is_day: 1,
			},
		};

		render(<Weather data={mockData} location={mockLocation} />);

		expect(screen.getByText(/12.5 km\/h/)).toBeInTheDocument();
	});

	it("displays UV index when available", () => {
		const mockData: WeatherResponse = {
			latitude: -27.47,
			longitude: 153.02,
			current: {
				temperature_2m: 25.5,
				weather_code: 0,
				is_day: 1,
			},
			daily: {
				uv_index_max: [7.5],
			},
		};

		render(<Weather data={mockData} location={mockLocation} />);

		expect(screen.getByText(/7.5/)).toBeInTheDocument();
	});

	it("displays weather condition", () => {
		const mockData: WeatherResponse = {
			latitude: -27.47,
			longitude: 153.02,
			current: {
				temperature_2m: 25.5,
				weather_code: 0,
				is_day: 1,
			},
		};

		render(<Weather data={mockData} location={mockLocation} />);

		expect(screen.getByText(/Clear sky/)).toBeInTheDocument();
	});

	it("uses fallback to current_weather when current is not available", () => {
		const mockData: WeatherResponse = {
			latitude: -27.47,
			longitude: 153.02,
			current_weather: {
				temperature: 20.3,
				weathercode: 2,
				is_day: 0,
			},
		};

		render(<Weather data={mockData} location={mockLocation} />);

		expect(screen.getByText(/20.3°/)).toBeInTheDocument();
		expect(screen.getByText(/Partly cloudy/)).toBeInTheDocument();
	});
});
