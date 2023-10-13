import { Ctx, Message, On, Update } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';

import { ConfigRules, Rule, Rules } from './intefaces/rules.interface';
import { Context } from './intefaces/context.interface';

@Update()
export class AppUpdate {
  triggerRules: Rules;

  constructor(config: ConfigService) {
    const rules = config.get<ConfigRules>('rules');
    this.triggerRules = Object.values(rules).map<Rule>((rule) => (message) => {
      if (rule.aliases != null) {
        for (const alias of rule.aliases) {
          if (message.includes(alias)) {
            return rule.media_id;
          }
        }
      }

      let substring = message;

      for (const sequenceElement of rule.sequence) {
        if (typeof sequenceElement === 'string') {
          if (!substring.includes(sequenceElement)) return null;
          substring = substring.slice(substring.indexOf(sequenceElement));
        } else {
          const idx = sequenceElement
            .map((element) => substring.indexOf(element))
            .filter((i) => i !== -1);

          if (idx.length === 0) return null;

          const index = Math.min(...idx);
          substring = substring.slice(index + 1);
        }
      }

      return rule.media_id;
    });
  }

  @On('message')
  async handleText(@Ctx() ctx: Context, @Message('text') raw?: string) {
    const message = raw?.toLowerCase() ?? null;

    if (message == null) return;

    for (const rule of this.triggerRules) {
      const mediaId = rule(message);
      if (mediaId !== null) {
        await ctx.replyWithAnimation(mediaId);
        return;
      }
    }
  }
}
