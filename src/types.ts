/** Input accepted by the Instagram Comment Winner Picker Actor. */
export interface Input {
    /** Instagram post or reel URLs to collect comments from. */
    postUrls: string[];
    /** How many winners to randomly pick from the eligible pool. */
    numberOfWinners: number;
    /** Max comments to scrape per post (passed to the scraper as resultsLimit). */
    maxCommentsPerPost?: number;
    /** Keep only the first comment per username when true. */
    uniqueUsers?: boolean;
    /** Require the comment to tag at least one other account (@someone). */
    requireMention?: boolean;
    /** Require the comment text to contain this keyword/hashtag (case-insensitive). */
    requiredKeyword?: string | null;
}

/**
 * Shape of a single comment as returned by the `apify/instagram-comment-scraper`
 * Actor's dataset. Fields are optional because the upstream output can vary.
 */
export interface ScrapedComment {
    id?: string;
    text?: string;
    ownerUsername?: string;
    ownerProfilePicUrl?: string;
    timestamp?: string;
    /** URL of the post the comment belongs to (named `postUrl` in upstream output). */
    postUrl?: string;
    /** Direct link to the comment, when available. */
    commentUrl?: string;
    repliesCount?: number;
    likesCount?: number;
    [key: string]: unknown;
}

/** A comment that has been selected as a winner. */
export interface Winner extends ScrapedComment {
    winnerRank: number;
}
