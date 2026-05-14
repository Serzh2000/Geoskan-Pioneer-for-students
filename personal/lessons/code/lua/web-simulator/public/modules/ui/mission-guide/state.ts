import type { ScriptLanguage } from '../api-docs/sections.js';
import type { GuideLesson, GuideLessonState, RuntimeBanner } from './types.js';

const activeLessonByLanguage: Record<ScriptLanguage, string> = {
    lua: '',
    python: ''
};

const lessonSequences = new Map<string, string[]>();
const lessonWorkspaceXml = new Map<string, string>();
const lessonBanners = new Map<string, RuntimeBanner>();
const lessonChecks = new Map<string, boolean>();
const lessonSolutionVisibility = new Map<string, boolean>();
const lessonGeneratedCodeVisibility = new Map<string, boolean>();

function getStateKey(language: ScriptLanguage, lessonId: string): string {
    return `${language}:${lessonId}`;
}

export function ensureActiveLessonId(language: ScriptLanguage, lessonId: string): void {
    if (!activeLessonByLanguage[language]) {
        activeLessonByLanguage[language] = lessonId;
    }
}

export function setActiveLessonId(language: ScriptLanguage, lessonId: string): void {
    activeLessonByLanguage[language] = lessonId;
}

export function getActiveLesson(state: GuideLessonState, language: ScriptLanguage): GuideLesson {
    const desiredId = activeLessonByLanguage[language] || state.activeLessonId;
    return state.lessons.find((lesson) => lesson.id === desiredId) || state.lessons[0];
}

export function getLessonSequence(language: ScriptLanguage, lessonId: string): string[] {
    const key = getStateKey(language, lessonId);
    if (!lessonSequences.has(key)) {
        lessonSequences.set(key, []);
    }
    return [...(lessonSequences.get(key) || [])];
}

export function setLessonSequence(language: ScriptLanguage, lessonId: string, sequence: string[]): void {
    lessonSequences.set(getStateKey(language, lessonId), [...sequence]);
}

export function setLessonWorkspaceState(language: ScriptLanguage, lessonId: string, xml: string | null): void {
    const key = getStateKey(language, lessonId);
    if (xml) lessonWorkspaceXml.set(key, xml);
    else lessonWorkspaceXml.delete(key);
}

export function getLessonWorkspaceState(language: ScriptLanguage, lessonId: string): string | null {
    return lessonWorkspaceXml.get(getStateKey(language, lessonId)) || null;
}

export function clearLessonSequence(language: ScriptLanguage, lessonId: string): void {
    lessonSequences.set(getStateKey(language, lessonId), []);
    lessonWorkspaceXml.delete(getStateKey(language, lessonId));
}

export function setLessonBanner(language: ScriptLanguage, lessonId: string, banner: RuntimeBanner | null): void {
    const key = getStateKey(language, lessonId);
    if (banner) lessonBanners.set(key, banner);
    else lessonBanners.delete(key);
}

export function getLessonBanner(language: ScriptLanguage, lessonId: string): RuntimeBanner | null {
    return lessonBanners.get(getStateKey(language, lessonId)) || null;
}

export function setLessonChecked(language: ScriptLanguage, lessonId: string, checked: boolean): void {
    lessonChecks.set(getStateKey(language, lessonId), checked);
}

export function isLessonChecked(language: ScriptLanguage, lessonId: string): boolean {
    return lessonChecks.get(getStateKey(language, lessonId)) || false;
}

export function setLessonSolutionVisible(language: ScriptLanguage, lessonId: string, visible: boolean): void {
    lessonSolutionVisibility.set(getStateKey(language, lessonId), visible);
}

export function isLessonSolutionVisible(language: ScriptLanguage, lessonId: string): boolean {
    return lessonSolutionVisibility.get(getStateKey(language, lessonId)) || false;
}

export function setLessonGeneratedCodeVisible(language: ScriptLanguage, lessonId: string, visible: boolean): void {
    lessonGeneratedCodeVisibility.set(getStateKey(language, lessonId), visible);
}

export function isLessonGeneratedCodeVisible(language: ScriptLanguage, lessonId: string): boolean {
    return lessonGeneratedCodeVisibility.get(getStateKey(language, lessonId)) || false;
}
