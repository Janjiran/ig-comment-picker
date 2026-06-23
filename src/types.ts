/** Input accepted by the Instagram Comment Winner Picker Actor. */
export interface Input {
    /** Instagram post or reel URLs to collect comments from. */
    postUrls: string[];
    /** How many winners to randomly pick from the eligible pool. */
    numberOfWinners: number;
    /** Max comments to scrape per post. */
    maxCommentsPerPost?: number;
    /** Keep only the first comment per username when true. */
    uniqueUsers?: boolean;
    /** Require the comment to tag at least one other account (@someone). */
    requireMention?: boolean;
    /** Require the comment text to contain this keyword/hashtag (case-insensitive). */
    requiredKeyword?: string | null;
}

/**
 * Canonical shape of a single comment after normalization. Fields are optional
 * because the upstream scraper output can vary; the index signature preserves any
 * extra raw fields (e.g. `likes`, `childCommentCount`, `id`).
 */
export interface ScrapedComment {
    id?: string;
    text?: string;
    ownerUsername?: string;
    ownerFullName?: string;
    ownerProfilePicUrl?: string;
    timestamp?: string;
    /** URL of the post the comment belongs to. */
    postUrl?: string;
    /** Direct link to the comment, when available. */
    commentUrl?: string;
    likes?: number;
    [key: string]: unknown;
}

/** A comment that has been selected as a winner. */
export interface Winner extends ScrapedComment {
    winnerRank: number;
}
