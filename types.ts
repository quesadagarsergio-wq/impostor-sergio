export interface WordPair {
  id: string;
  word: string;
  hint: string;
}

export interface Player {
  id: number;
  name: string;
  isImpostor: boolean;
  votesReceived: number;
}

export enum GamePhase {
  HOME = 'HOME',
  MANAGE = 'MANAGE',
  SETUP = 'SETUP',
  REVEAL = 'REVEAL',
  PLAYING = 'PLAYING',
  VOTE = 'VOTE',
  RESULT = 'RESULT'
}

export enum RevealState {
  WAITING = 'WAITING',
  SHOWING = 'SHOWING',
  DONE = 'DONE'
}
