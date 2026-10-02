// Career start: used to compute "years of experience" instead of hard-coding it.
export const CAREER_START_YEAR = 2013;

export const yearsInQA = (now = new Date()) => now.getFullYear() - CAREER_START_YEAR;
