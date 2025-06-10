function scoreWeather(weather, eventType) {
  if (!weather) return { score: 0, suitability: 'Poor' };

  const { temperature, precipitation, windSpeed, description } = weather;
  let score = 0;
  let category = '';

  //Outdoor Sports Scoring
  if (['Cricket', 'Hiking', 'Football'].includes(eventType)) {
    category = 'Outdoor Sports';

    if (temperature >= 15 && temperature <= 30) score += 30;
    if (precipitation < 20) score += 25;
    if (windSpeed < 20) score += 20;
    if (description.includes('clear') || description.includes('partly')) score += 25;
  }

  //Wedding/Formal Event Scoring
  else if (['Wedding', 'Corporate'].includes(eventType)) {
    category = 'Wedding/Formal';

    if (temperature >= 18 && temperature <= 28) score += 30;
    if (precipitation < 10) score += 30;
    if (windSpeed < 15) score += 25;
    if (description.includes('clear') || description.includes('partly')) score += 15;
  }

  //Fallback Scoring for Unknown Types
  else {
    category = 'Generic';

    if (temperature >= 16 && temperature <= 32) score += 20;
    if (precipitation < 30) score += 20;
    if (windSpeed < 25) score += 15;
    if (description.includes('clear') || description.includes('partly')) score += 10;
  }

  // Final Suitability Rating
  let suitability = 'Poor';
  if (score >= 80) suitability = 'Good';
  else if (score >= 50) suitability = 'Okay';

  return { score, suitability, category };
}
module.exports = { scoreWeather };