# Instagram Comment Picker 🎉 - Free & Fair Giveaway Winner Generator

**Pick a random winner from your Instagram comments in seconds.** This Instagram
comment picker (a.k.a. Instagram giveaway picker / random comment winner generator)
reads all the comments on any Instagram **post or reel**, applies the giveaway rules
you choose, and randomly draws one or more winners for you - no manual scrolling,
copy‑pasting, or screenshots required.

Perfect for **Instagram giveaways, contests, raffles, and prize draws** run by
creators, small businesses, shops, and marketing teams who want a fast, transparent,
and fair way to choose a winner.

> 💡 **Not a developer?** You don't need to be. Just paste your post link, choose how
> many winners you want, and click **Start**. Results appear in a clean table you can
> download as Excel, CSV, or JSON.

---

## What you can use it for

- 🎁 **Instagram giveaway winner picker** - draw a fair winner from comments.
- 🏆 **Contest & raffle draws** - pick multiple winners at once.
- 🤝 **"Tag a friend" promotions** - only count comments that tag someone.
- #️⃣ **Hashtag / keyword campaigns** - only count comments containing your keyword.
- 📊 **Comment exports** - get a clean list of everyone who commented.

## How to pick a winner in 3 steps

1. **Paste your Instagram link.** Add one or more post/reel URLs (e.g.
   `https://www.instagram.com/reel/ABC123/`).
2. **Choose your rules.** Set how many winners you want and, optionally, require
   tagging a friend or a specific keyword/hashtag.
3. **Click Start.** In under a minute you get your randomly drawn winner(s), ready to
   announce. Download them as Excel/CSV/JSON or copy them straight from the table.

That's it - no login to your Instagram account needed.

## Settings explained (in plain English)

| Setting | What it does |
| --- | --- |
| **Instagram post URLs** | The post(s) or reel(s) you're running the giveaway on. You can add several and the comments are combined into one pool. |
| **Number of winners** | How many winners to randomly draw. |
| **Max comments per post** | How many comments to read per post. Higher = more thorough (and slightly more credits). |
| **Unique users only** | On by default - the same person can't win twice, even if they commented many times. |
| **Must mention/tag someone** | Only count comments that tag a friend (e.g. `@bestie`). Great for "tag a friend" rules. |
| **Required keyword / hashtag** | Only count comments that include your word or hashtag (e.g. `#giveaway`). |

### Example settings

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

## What you get (results)

- A **Winners** table with each winner's username, their comment, the post link, and
  when they commented - exportable to **Excel, CSV, JSON, or HTML**.
- A summary record (`OUTPUT`) with the winners plus useful stats: total comments read,
  how many were eligible after your rules, and the settings used - handy proof that the
  draw was fair.

## 🤖 Use it with AI assistants (ChatGPT, Claude & others)

This Actor is built to be **AI‑agent friendly**, so assistants like **ChatGPT, Claude,
and other LLM tools** can run your giveaway for you when asked something like
*"pick a random winner from the comments on this Instagram post."*

Apify exposes every Actor as a tool through the **[Apify MCP server](https://mcp.apify.com)**
([docs](https://docs.apify.com/platform/integrations/mcp)). Once connected, an AI
assistant can discover this Instagram comment picker and call it directly.

**Connect it to a Claude Desktop / MCP‑compatible client** by adding:

```json
{
    "mcpServers": {
        "apify": {
            "url": "https://mcp.apify.com",
            "headers": { "Authorization": "Bearer YOUR_APIFY_TOKEN" }
        }
    }
}
```

**Try a prompt like:**

> "Use the Instagram Comment Picker Actor to draw 2 random winners from the comments on
> https://www.instagram.com/reel/ABC123/ - only count comments that tag a friend."

The assistant will run the Actor and hand back the winners. (Get your token from the
[Apify Console → Settings → Integrations](https://console.apify.com/account/integrations).)

## Frequently asked questions

**Is this a fair / random Instagram comment picker?**
Yes. Eligible comments are shuffled with a uniform random draw, so every qualifying
comment has an equal chance. The result includes the comment count and rules used, so
you can show your audience the draw was unbiased.

**Can I pick more than one winner?**
Yes - set **Number of winners** to any amount. You can also keep it fair by leaving
**Unique users only** on, so one person can't take multiple prizes.

**Does it work on Reels as well as photo posts?**
Yes - it works on Instagram **posts and reels**.

**Do I need to log in to Instagram?**
No. You only provide the public post link.

**Can I require people to tag a friend or use a hashtag?**
Yes - turn on **Must mention/tag someone** and/or set a **Required keyword/hashtag**.

**Is it free?**
The Actor itself is lightweight, but it reads comments via Apify's official Instagram
comment scraper, which uses a small amount of Apify platform credits per run. New Apify
accounts include free monthly usage to get started.

**Why might the comment count differ from what I see on Instagram?**
Comments are read as a logged‑out visitor would see them, so the total can differ
slightly from your logged‑in view (some replies/filtered comments may not appear).

---

## For developers

This is an [Apify Actor](https://apify.com/actors) written in **TypeScript**. It calls
Apify's official
[`apify/instagram-comment-scraper`](https://apify.com/apify/instagram-comment-scraper)
to collect comments, then filters and randomly draws winners.

### Input schema

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `postUrls` | `string[]` | ✅ | - | Instagram post/reel URLs. Comments are pooled across all of them. |
| `numberOfWinners` | `integer` | ✅ | `1` | How many winners to randomly pick. |
| `maxCommentsPerPost` | `integer` | - | `100` | Max comments scraped per post (passed as `resultsLimit`). |
| `uniqueUsers` | `boolean` | - | `true` | Each username can win at most once (first comment per user is kept). |
| `requireMention` | `boolean` | - | `false` | Only comments tagging another account (`@someone`) are eligible. |
| `requiredKeyword` | `string` | - | - | Only comments containing this keyword/hashtag (case‑insensitive) are eligible. |

### Output

- **Default dataset** - one record per winner (`winnerRank`, `ownerUsername`, `text`,
  `postUrl`, `commentUrl`, `timestamp`, …).
- **Key‑value store `OUTPUT`** - summary: `winners`, `totalComments`, `eligibleCount`,
  the applied `filters`, and the input `postUrls`.

### Run locally

```bash
npm install
# A token is required because the Actor calls a paid Apify Actor:
export APIFY_TOKEN=your_apify_api_token
# Put your input in storage/key_value_stores/default/INPUT.json, then:
npm start
```

Build the production JavaScript with `npm run build`. Deploy with
[`apify push`](https://docs.apify.com/cli).

## Limitations & disclaimer

The underlying comment scraper only sees comments visible to **logged‑out** users, so
results can differ from what you see while logged in to Instagram. This tool is not
affiliated with or endorsed by Instagram or Meta. Always follow
[Instagram's promotion guidelines](https://help.instagram.com/) when running giveaways.
