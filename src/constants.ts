export const jsonObjectRegExp = /\{.*\}/gs;

export const REDACTED = '[REDACTED]';

export enum TabStatus {
  Loading = 'loading',
  Complete = 'complete',
}

export enum ReadyStates {
  Complete = 'complete',
  Interactive = 'interactive',
  Loading = 'loading',
}

/**
 * @see https://unicode.org/emoji/charts/full-emoji-list.html
 */
export enum Emoji {
  PlusSign = '➕',
  Horns = '🤘',
  ThumbsUp = '👍',
  ThumbsDown = '👎',
  HourGlassNotDone = '⏳',
  HourGlassDone = '⌛',
}

export const prettifyJson = 'Prettify JSON';

export const prettifyJsonClassName = 'prettify-json';
