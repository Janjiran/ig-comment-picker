# Instagram Comment Winner Picker 🎉

An [Apify Actor](https://apify.com/actors) (TypeScript) that scrapes the comments
from one or more Instagram posts/reels and **randomly picks a user-defined number of
winners** — perfect for running giveaways and raffles.

It does **not** scrape Instagram itself. Instead it calls Apify's official
[`apify/instagram-comment-scraper`](https://apify.com/apify/instagram-comment-scraper)
Actor to collect the comments, then applies eligibility filters and draws the winners.

## Input

| Field                | Type      | Required | Default | Description                                                                 |
| -------------------- | --------- | -------- | ------- | --------------------------------------------------------------------------- |
| `postUrls`           | string[]  | ✅       | —       | Instagram post/reel URLs. Comments are pooled across all of them.           |
| `numberOfWinners`    | integer   | ✅       | `1`     | How many winners to randomly pick.                                          |
| `maxCommentsPerPost` | integer   | —        | `100`   | Max comments scraped per post (passed as `resultsLimit` to the scraper).    |
| `uniqueUsers`        | boolean   | —        | `true`  | Each username can win at most once (first comment per user is kept).        |
| `requireMention`     | boolean   | —        | `false` | Only comments tagging another account (`@someone`) are eligible.            |
| `requiredKeyword`    | string    | —        | —       | Only comments containing this keyword/hashtag (case-insensitive) eligible.  |

### Example input

```json
{
    "postUrls": ["https://www.instagram.com/p/DN8-GjPkgjS/"],
    "numberOfWinners": 3,
    "maxCommentsPerPost": 200,
    "uniqueUsers": true,
    "requireMention": true,
    "requiredKeyword": "#giveaway"
}
```

## Output

- **Default dataset** — one record per winner (`winnerRank`, `ownerUsername`, `text`,
  `postUrl`, `commentUrl`, `timestamp`, …).
- **Key-value store `OUTPUT`** — a summary: `winners`, `totalComments`,
  `eligibleCount`, the applied `filters`, and the input `postUrls`.

## Run locally

```bash
npm install
# A token is required because the Actor calls a paid Apify Actor:
export APIFY_TOKEN=your_apify_api_token
# Put your input in storage/key_value_stores/default/INPUT.json, then:
npm start
```

Build the production JavaScript with `npm run build`. Deploy with
[`apify push`](https://docs.apify.com/cli).

## Limitations

The underlying comment scraper only sees comments visible to **logged-out** users, so
results can differ from what you see while logged in to Instagram.
