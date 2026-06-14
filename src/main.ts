import { Actor, log } from 'apify';

import type { Input, ScrapedComment, Winner } from './types.js';

/** Actor ID of Apify's official Instagram Comment Scraper. */
const COMMENT_SCRAPER_ACTOR_ID = 'apify/instagram-comment-scraper';

/** Matches an Instagram-style mention, e.g. "@friend_01" or "@some.user". */
const MENTION_REGEX = /@[A-Za-z0-9._]+/;

/** Fisher–Yates in-place shuffle, returning a new shuffled array. */
function shuffle<T>(input: readonly T[]): T[] {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

await Actor.init();

try {
    const input = await Actor.getInput<Input>();
    if (!input) throw new Error('Missing input. Provide at least "postUrls" and "numberOfWinners".');

    const {
        postUrls,
        numberOfWinners,
        maxCommentsPerPost = 100,
        uniqueUsers = true,
        requireMention = false,
        requiredKeyword,
    } = input;

    // --- Validate input ---------------------------------------------------
    if (!Array.isArray(postUrls) || postUrls.length === 0) {
        throw new Error('Input "postUrls" must be a non-empty array of Instagram post/reel URLs.');
    }
    if (!Number.isInteger(numberOfWinners) || numberOfWinners < 1) {
        throw new Error('Input "numberOfWinners" must be an integer >= 1.');
    }

    const directUrls = postUrls.map((u) => u.trim()).filter(Boolean);
    log.info('Starting Instagram Comment Winner Picker', {
        postCount: directUrls.length,
        numberOfWinners,
        maxCommentsPerPost,
        uniqueUsers,
        requireMention,
        requiredKeyword: requiredKeyword || null,
    });

    // --- Scrape comments via the official Apify Actor ---------------------
    log.info(`Calling "${COMMENT_SCRAPER_ACTOR_ID}" to scrape comments...`);
    const run = await Actor.call(COMMENT_SCRAPER_ACTOR_ID, {
        directUrls,
        resultsLimit: maxCommentsPerPost,
    });

    if (!run || run.status !== 'SUCCEEDED') {
        throw new Error(`Comment scraper run did not succeed (status: ${run?.status ?? 'UNKNOWN'}).`);
    }

    const { items } = await Actor.apifyClient.dataset(run.defaultDatasetId).listItems();
    const comments = items as unknown as ScrapedComment[];
    log.info(`Scraper returned ${comments.length} comment(s).`);

    if (comments.length === 0) {
        log.warning(
            'No comments were scraped. The post may have no comments, be private, or comments may be '
            + 'hidden from logged-out users. No winners can be picked.',
        );
        await Actor.setValue('OUTPUT', {
            winners: [],
            totalComments: 0,
            eligibleCount: 0,
            postUrls: directUrls,
        });
        await Actor.exit('Finished: no comments found.');
    }

    // --- Filter to the eligible pool --------------------------------------
    const keyword = requiredKeyword?.trim().toLowerCase();
    const seenUsers = new Set<string>();

    const eligible = comments.filter((c) => {
        const text = (c.text ?? '').trim();
        const username = (c.ownerUsername ?? '').trim();
        if (!text || !username) return false;

        if (keyword && !text.toLowerCase().includes(keyword)) return false;
        if (requireMention && !MENTION_REGEX.test(text)) return false;

        if (uniqueUsers) {
            const key = username.toLowerCase();
            if (seenUsers.has(key)) return false;
            seenUsers.add(key);
        }
        return true;
    });

    log.info(`Eligible comments after filtering: ${eligible.length}`);

    if (eligible.length === 0) {
        log.warning('No comments match the selected filters. No winners can be picked.');
        await Actor.setValue('OUTPUT', {
            winners: [],
            totalComments: comments.length,
            eligibleCount: 0,
            postUrls: directUrls,
        });
        await Actor.exit('Finished: no eligible comments.');
    }

    // --- Randomly draw the winners ----------------------------------------
    if (numberOfWinners > eligible.length) {
        log.warning(
            `Requested ${numberOfWinners} winners but only ${eligible.length} eligible comment(s) `
            + 'are available. Returning all eligible comments as winners.',
        );
    }

    const drawCount = Math.min(numberOfWinners, eligible.length);
    const winners: Winner[] = shuffle(eligible)
        .slice(0, drawCount)
        .map((comment, index) => ({ ...comment, winnerRank: index + 1 }));

    log.info(`🎉 Picked ${winners.length} winner(s):`);
    for (const w of winners) {
        log.info(`  #${w.winnerRank}  @${w.ownerUsername} — "${(w.text ?? '').slice(0, 80)}"`);
    }

    // --- Output -----------------------------------------------------------
    await Actor.pushData(winners);
    await Actor.setValue('OUTPUT', {
        winners,
        totalComments: comments.length,
        eligibleCount: eligible.length,
        numberOfWinners: winners.length,
        postUrls: directUrls,
        filters: { uniqueUsers, requireMention, requiredKeyword: requiredKeyword || null },
    });

    log.info('Done. Winners saved to the default dataset and to the OUTPUT key-value record.');
} catch (err) {
    log.exception(err as Error, 'Actor failed.');
    await Actor.fail((err as Error).message);
}

await Actor.exit();
