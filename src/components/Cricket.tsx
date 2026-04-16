import React from "react";

const Cricket: React.FC = () => {
return (
<section aria-label="Cricket in Australia">
<h2 className="mb-3 text-base font-semibold text-gray-800 dark:text-gray-200">Cricket in Australia</h2>

<div className="rounded-xl border border-gray-200 bg-gradient-to-br from-sky-50 to-blue-50 p-5 shadow-sm dark:border-gray-700 dark:from-gray-900 dark:to-gray-950">
<section className="mb-4">
<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Overview</h3>
<p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
Cricket is one of Australia&apos;s most popular sports, with a rich history dating back to the early 19th century. The game is played at grassroots, domestic and international levels across the country and has produced some of the world&apos;s greatest players and memorable moments.
</p>
</section>

<section className="mb-4">
<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Major competitions</h3>
<ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
<li>
<strong>Big Bash League (BBL)</strong> — Australia&apos;s premier domestic T20 competition featuring city-based franchises and top international and national players.
</li>
<li>
<strong>Sheffield Shield</strong> — The long-standing first-class competition contested by state teams across multiple days.
</li>
<li>
<strong>Marsh One-Day Cup</strong> — The domestic 50-over competition that helps identify players for the national ODI side.
</li>
</ul>
</section>

<section className="mb-4">
<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Iconic venues</h3>
<p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
Australia hosts many historic cricket grounds, including:
</p>
<ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
<li>Melbourne Cricket Ground (MCG)</li>
<li>Sydney Cricket Ground (SCG)</li>
<li>The Gabba (Brisbane)</li>
<li>WACA (Perth)</li>
<li>Adelaide Oval</li>
</ul>
</section>

<section className="mb-4">
<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Key facts &amp; records</h3>
<ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
<li>Australia has won multiple Cricket World Cups and has one of the strongest Test records.</li>
<li>Historic rivalries, especially The Ashes against England, are central to Australian cricket culture.</li>
<li>Australian players hold numerous international records in batting, bowling and fielding.</li>
</ul>
</section>

<section>
<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">National teams</h3>
<p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
Australia fields both men&apos;s and women&apos;s national teams that compete at the highest international levels across Test, ODI and T20 formats. The women&apos;s team has also been one of the most successful sides in global competitions, helping grow the game domestically.
</p>
</section>
</div>
</section>
);
};

export default Cricket;
