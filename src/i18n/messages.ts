import { en } from "./en";
import type { Locale } from "./locales";
import { ms } from "./ms";
import type { Messages } from "./types";

const dictionaries: Record<Locale, Messages> = { en, ms };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}
