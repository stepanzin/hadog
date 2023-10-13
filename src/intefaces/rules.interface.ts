export type Rule = (message: string) => string | null;
export type Rules = Array<Rule>;

export type ConfigRule = {
  media_id: string;
  sequence: Array<string | string[]>;
  aliases?: string[];
};

export type ConfigRules = Record<string, ConfigRule>;
