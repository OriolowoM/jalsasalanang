async function findWhere() {
  const res = await fetch('http://localhost:3000/articles/ahmadiyya-to-hold-70th-annual-conference-in-nigeria');
  const html = await res.text();
  const lines = html.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('wp-content')) {
      console.log(`Line ${i}:`, lines[i].substring(0, 300));
    }
  }
}
findWhere();
