echo "Checking Recent:"
curl -s "https://api-consumet-ruddy.vercel.app/meta/anilist/recent-episodes" | head -c 200
echo "\nChecking Search:"
curl -s "https://api-consumet-ruddy.vercel.app/meta/anilist/naruto" | head -c 200
echo "\nChecking Info (One Piece):"
curl -s "https://api-consumet-ruddy.vercel.app/meta/anilist/info/21" > op.json
cat op.json | head -c 200
echo "\nChecking Watch (First EP):"
EP_ID=$(cat op.json | grep -o '"id":"[^"]*"' | head -n 1 | cut -d'"' -f4)
echo "Episode ID: $EP_ID"
curl -s "https://api-consumet-ruddy.vercel.app/meta/anilist/watch/$EP_ID" | head -c 200
