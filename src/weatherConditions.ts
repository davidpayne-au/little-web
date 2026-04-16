export type WeatherCondition = {
  label: string;
  emoji: string;
};

export function getWeatherCondition(code?: number, isDay?: number): WeatherCondition {
  if (code === 0) {
    return { label: "Clear sky", emoji: isDay === 0 ? "🌙" : "☀️" };
  }

  if (code === 1 || code === 2 || code === 3) {
    return { label: "Partly cloudy", emoji: "⛅" };
  }

  if (code === 45 || code === 48) {
    return { label: "Foggy", emoji: "🌫️" };
  }

  if ((code ?? -1) >= 51 && (code ?? -1) <= 67) {
    return { label: "Rain", emoji: "🌧️" };
  }

  if ((code ?? -1) >= 71 && (code ?? -1) <= 77) {
    return { label: "Snow", emoji: "❄️" };
  }

  if (code === 80 || code === 81 || code === 82) {
    return { label: "Rain showers", emoji: "🌦️" };
  }

  if (code === 85 || code === 86) {
    return { label: "Snow showers", emoji: "🌨️" };
  }

  if (code === 95 || code === 96 || code === 99) {
    return { label: "Thunderstorm", emoji: "⛈️" };
  }

  return { label: "Unknown conditions", emoji: "🌤️" };
}
