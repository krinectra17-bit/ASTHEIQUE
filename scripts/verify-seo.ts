async function verifySitemapAndRobots() {
  console.log('Testing SEO & Crawler Endpoints:');

  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  console.log('1. GET /sitemap.xml Status:', sitemapRes.status);
  console.log('   Content-Type:', sitemapRes.headers.get('content-type'));
  console.log('   Includes <urlset>:', sitemapText.includes('<urlset'));
  console.log('   Sample URL:', sitemapText.substring(0, 300));

  const robotsRes = await fetch('http://localhost:3000/robots.txt');
  const robotsText = await robotsRes.text();
  console.log('\n2. GET /robots.txt Status:', robotsRes.status);
  console.log('   Content-Type:', robotsRes.headers.get('content-type'));
  console.log('   Includes User-agent:', robotsText.includes('User-agent'));
  console.log('   Content:\n' + robotsText);
}

verifySitemapAndRobots().catch(console.error);
