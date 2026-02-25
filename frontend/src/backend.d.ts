import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Word {
    text: string;
    translation: string;
    category: string;
}
export interface UserProgress {
    totalScore: bigint;
    stars: bigint;
    completedLessons: bigint;
}
export interface UserProfile {
    age?: bigint;
    preferredLanguage: string;
    name: string;
}
export enum Reward {
    goldStar = "goldStar",
    bronzeStar = "bronzeStar",
    silverStar = "silverStar"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    awardReward(user: Principal, reward: Reward): Promise<void>;
    checkQuizAnswer(word: string, translation: string): Promise<boolean>;
    completeLesson(score: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProgress(): Promise<UserProgress>;
    getRewards(): Promise<Array<Reward>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(user: Principal): Promise<UserProgress>;
    getUserRewards(user: Principal): Promise<Array<Reward>>;
    getWordsByCategory(category: string): Promise<Array<Word>>;
    initializeVocabulary(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
