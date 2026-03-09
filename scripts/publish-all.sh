#!/bin/bash
# Publish all articles for a given date across all 4 MyWay sites
# Usage: ./publish-all.sh 2026-03-09

DATE="$1"
if [ -z "$DATE" ]; then
  echo "Usage: $0 YYYY-MM-DD"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCHEDULED_DIR="$SCRIPT_DIR/../scheduled"
TEMP_FILE="$SCHEDULED_DIR/${DATE}.json"

echo "=== Publishing all articles for $DATE ==="

# Find all JSON files matching the date (handle spaces in path)
COUNT=0
for FILE in "$SCHEDULED_DIR"/${DATE}-*.json; do
  [ -f "$FILE" ] || continue
  COUNT=$((COUNT + 1))
done

if [ "$COUNT" -eq 0 ]; then
  echo "No articles found for $DATE"
  exit 0
fi

echo "Found $COUNT article(s)"

for FILE in "$SCHEDULED_DIR"/${DATE}-*.json; do
  [ -f "$FILE" ] || continue
  BASENAME=$(basename "$FILE")
  SLUG=$(echo "$BASENAME" | sed "s/^${DATE}-//" | sed 's/\.json$//')
  echo ""
  echo "--- Processing: $SLUG ---"

  # Temporarily copy to expected filename
  cp "$FILE" "$TEMP_FILE"

  # Generate article files for all 4 sites
  node "$SCRIPT_DIR/publish-article.cjs" "$DATE"

  # Update blog indexes
  node "$SCRIPT_DIR/update-blog-index.cjs" "$DATE"
  node "$SCRIPT_DIR/update-katalog-index.cjs" "$DATE"
  node "$SCRIPT_DIR/update-eduway-index.cjs" "$DATE"

  # Update osrodek-myway (App.tsx routes + Blog.tsx/MyTherapy.tsx feeds)
  node "$SCRIPT_DIR/update-osrodek-app.cjs" "$DATE"
  node "$SCRIPT_DIR/update-osrodek-feeds.cjs" "$DATE"

  # Remove temp file
  rm -f "$TEMP_FILE"

  echo "--- Done: $SLUG ---"
done

echo ""
echo "=== All $COUNT articles published for $DATE ==="
echo ""
echo "Next steps:"
echo "1. Review generated files"
echo "2. Git commit and push all repos"
