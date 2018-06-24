//Secret key
export let secret = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret';

// MongoDB address
export let mongodb = "mongodb://localhost/test";

// Get timestamp of one day. You can set your own time zone
export function getDay(offset = 0) {
  let d = new Date();
  d.setHours(0,0,0,0);
  return d.setDate(d.getDate() - offset);
}

// Learning states.
export const LEARNING_STATES = {
  NO_LEARN: 0,
  START_LEARNING: 1,
  // LEARNING is floating pointer number between START and FINISH.
  FINISHED: 7,
};

// How many days should one learning state state stays
// It should match LEARNING_STATES
export const LEARNING_DAYS = {
  2: 1, // For instance, today I learn a word and it becomes state2,
        // then it should appear the next day and let me learn it to state 3
  3: 2,
  4: 4,
  5: 7,
  6: 15,
};

// Cycle days to finish learning a word
export const CYCLE_DAYS = Object.values(LEARNING_DAYS).reduce((sum, v) => sum + v, 0);

// How many words to learn a day
export const TASK_NUM = 150;

// How many new words to learn a day.
export const TASK_NEW_WORD = Math.floor(TASK_NUM/CYCLE_DAYS);
// TODO: make it a configuration for each user.
