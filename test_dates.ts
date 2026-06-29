async function run() {
  try {
    const res = await fetch("https://streamed.pk/api/matches/football");
    const matches = await res.json();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    let todayCount = 0;
    let tomorrowCount = 0;
    let otherCount = 0;

    for (const match of matches) {
        const d = new Date(match.date);
        if (d >= today && d < tomorrow) {
            todayCount++;
        } else if (d >= tomorrow && d < dayAfter) {
            tomorrowCount++;
        } else {
            otherCount++;
        }
    }
    
    console.log(`Today: ${todayCount}, Tomorrow: ${tomorrowCount}, Other: ${otherCount}`);
  } catch (e) {
    console.error(e);
  }
}
run();
