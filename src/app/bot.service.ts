import { Injectable, computed, inject, signal } from '@angular/core';

import { Bot, Difficulty, Rule, Item, BotName } from './models/bot';
import { MarquiseBot } from './models/marquise';
import { EyrieBot } from './models/eyrie';
import { MarquiseBotDC } from './models/marquise-dc';
import { EyrieBotDC } from './models/eyrie-dc';
import { WoodlandBotDC } from './models/woodland-dc';
import { VagaBotDC } from './models/vagabond-dc';
import { WoodlandBot } from './models/woodland';
import { VagaBot } from './models/vagabond';
import { DuchyBot } from './models/duchy';
import { LizardBot } from './models/lizard';
import { CorvidBot } from './models/corvid';
import { RiverfolkBot } from './models/riverfolk';
import { LegionBot } from './models/legion';
import { AlertController, ModalController } from '@ionic/angular';
import { PriorityModalComponent } from './priority-modal/priority-modal.component';

@Injectable({
  providedIn: 'root',
})
export class BotService {
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);

  private readonly _bots = signal<Bot[]>([]);
  readonly bots = this._bots.asReadonly();
  readonly menuBots = this.bots;
  readonly splitPaneDisabled = computed(() => this._bots().length === 0);

  public botHash: Record<BotName, new () => Bot> = {
    Marquise: MarquiseBot,
    Eyrie: EyrieBot,
    Woodland: WoodlandBot,
    Vagabond: VagaBot,
    MarquiseDC: MarquiseBotDC,
    EyrieDC: EyrieBotDC,
    WoodlandDC: WoodlandBotDC,
    VagabondDC: VagaBotDC,
    Duchy: DuchyBot,
    Lizard: LizardBot,
    Corvid: CorvidBot,
    Riverfolk: RiverfolkBot,
    Legion: LegionBot,
  };

  public botMeta: Record<BotName, { icon: string; fullName: string }> = {
    Marquise: {
      icon: 'marquise',
      fullName: 'Mechanical Marquise',
    },
    Eyrie: {
      icon: 'eyrie',
      fullName: 'Electric Eyrie',
    },
    Woodland: {
      icon: 'woodland',
      fullName: 'Automated Alliance',
    },
    Vagabond: {
      icon: 'vagabond',
      fullName: 'Vagabot',
    },
    MarquiseDC: {
      icon: 'marquise',
      fullName: 'Mechanical Marquise (DC)',
    },
    EyrieDC: {
      icon: 'eyrie',
      fullName: 'Electric Eyrie (DC)',
    },
    WoodlandDC: {
      icon: 'woodland',
      fullName: 'Automated Alliance (DC)',
    },
    VagabondDC: {
      icon: 'vagabond',
      fullName: 'Vagabot (DC)',
    },
    Duchy: {
      icon: 'duchy',
      fullName: 'Drillbit Duchy',
    },
    Lizard: {
      icon: 'lizard',
      fullName: 'Logical Lizards',
    },
    Corvid: {
      icon: 'corvid',
      fullName: 'Cogwheel Corvids',
    },
    Riverfolk: {
      icon: 'riverfolk',
      fullName: 'Riverfolk Robots',
    },
    Legion: {
      icon: 'legion',
      fullName: 'Looting Legion',
    },
  };

  public itemImages: Record<Item, string> = {
    Sack: 'sack',
    Sack2: 'sack',
    Sack3: 'sack',
    Sack4: 'sack',
    Boot: 'boot',
    Boot2: 'boot',
    Boot3: 'boot',
    Boot4: 'boot',
    Boot5: 'boot',
    Boot6: 'boot',
    Boot7: 'boot',
    Sword: 'sword',
    Sword2: 'sword',
    Sword3: 'sword',
    Sword4: 'sword',
    Sword5: 'sword',
    Sword6: 'sword',
    Sword7: 'sword',
    Tea: 'tea',
    Tea2: 'tea',
    Tea3: 'tea',
    Coin: 'coin',
    Coin2: 'coin',
    Coin3: 'coin',
    Crossbow: 'crossbow',
    Crossbow2: 'crossbow',
    Crossbow3: 'crossbow',
    Hammer: 'hammer',
    Hammer2: 'hammer',
    Hammer3: 'hammer',
    Hammer4: 'hammer',
    Torch: 'torch',
    Torch2: 'torch',
    Torch3: 'torch',
  };

  private getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.floor(Math.random() * (max - min + 1))) + min;
  }

  private shuffleArray(array: unknown[]) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  constructor() {
    this.loadBots();
    this.checkUrlForBots();
  }

  // URL on init params for which bots to load: clockroot.seiyria.com/?bots=faction,names,here (such as /?bots=Corvid,Duchy)
  // For referencing the names in the URL ctrl+f for 'public name: BotName = '
  private checkUrlForBots() {
    const params = new URLSearchParams(window.location.search);
    const botsParam = params.get('bots');

    if (botsParam) {
      this.clearBots();
      const botNames = botsParam.split(',') as BotName[];
      botNames.forEach((name) => {
        if (this.botHash[name]) {
          const newBot = new (this.botHash[name] as new () => Bot)();
          this.addBot(newBot);
        }
      });
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }

  public changeAllDifficulties(difficulty: Difficulty) {
    this._bots().forEach((bot) => {
      this.changeDifficulty(bot, difficulty);
    });
  }

  public difficultyRandom() {
    const difficulties: Difficulty[] = [
      'Easy',
      'Normal',
      'Challenging',
      'Nightmare',
    ];

    this._bots().forEach((bot) => {
      const randomDiff = difficulties[this.getRandomIntInclusive(0, 3)];
      this.changeDifficulty(bot, randomDiff);
    });
  }

  public setTrait(num: number) {
    if (num === null || num === undefined) return;

    this._bots().forEach((bot) => {
      const togglableRules = bot.rules.filter((rule) => rule.canToggle);
      togglableRules.forEach((rule) => (rule.isActive = false));

      if (num > 0) {
        const shuffled = this.shuffleArray(togglableRules);
        const amountToSelect = num === 99 ? shuffled.length : num;
        const selectedRules = shuffled.slice(0, amountToSelect);
        selectedRules.forEach((rule) => ((rule as Rule).isActive = true));
      }
    });

    this.saveBots();
  }

  public addBot(bot: Bot) {
    if (this._bots().some((x) => x.name === bot.name)) {
      return;
    }

    this._bots.update((current) => [...current, bot]);
    this.saveBots();
  }

  public async removeBot(bot: Bot) {
    const alert = await this.alertCtrl.create({
      header: `Remove the ${bot.name} bot?`,
      message:
        'This will remove all rules, victory points, traits, and any other settings you have set for this bot.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Yes, remove!',
          handler: () => {
            this._bots.update((current) => current.filter((x) => x !== bot));
            this.saveBots();
          },
        },
      ],
    });

    await alert.present();
  }

  public clearBots() {
    this._bots.set([]);
    this.saveBots();
  }

  private generateTraitHash(bot: Bot) {
    bot.traitHash = bot.rules.reduce<Record<string, boolean>>((prev, cur) => {
      prev[cur.traitName] = cur.isActive ?? false;
      return prev;
    }, {});
  }

  public toggleSetup(bot: Bot) {
    bot.setupHidden = !bot.setupHidden;
    if (bot.setupHidden) {
      this.generateTraitHash(bot);
      bot.setup();
    }

    this.saveBots();
  }

  public changeDifficulty(bot: Bot, difficulty: Difficulty | string) {
    const allowed: Difficulty[] = [
      'Easy',
      'Normal',
      'Challenging',
      'Nightmare',
    ];
    if (!allowed.includes(difficulty as Difficulty)) {
      return;
    }
    bot.difficulty = difficulty as Difficulty;
    this.saveBots();
  }

  public setVP(bot: Bot, vp: number) {
    bot.vp = vp;
    this.saveBots();
  }

  public toggleItem(bot: Bot, item: Item) {
    bot.items[item] = !bot.items[item];

    // exceptions
    if (bot.items[item] && bot.name === 'Vagabond') {
      (bot as VagaBot).customData.satchelItems[item] = 0;
    }

    if (bot.items[item] && bot.name === 'VagabondDC') {
      (bot as VagaBotDC).customData.satchelItems[item] = 0;
    }

    this.saveBots();
  }

  public toggleRule(rule: Rule) {
    if (!rule.canToggle) {
      return;
    }

    // Toggle immediately so UI state doesn't lag behind the user's click.
    rule.isActive = !rule.isActive;
    this.saveBots();
  }

  public goToBot(botName: string) {
    window.location.href = `#${botName}`;
  }

  public saveBots() {
    localStorage.setItem('bots', JSON.stringify(this._bots()));
  }

  private loadBots() {
    const loadedBots = localStorage.getItem('bots') || '[]';
    const parsedBots: unknown = JSON.parse(loadedBots);

    const nextBots: Bot[] = [];

    if (!Array.isArray(parsedBots)) {
      this._bots.set([]);
      return;
    }

    parsedBots.forEach((bot: unknown) => {
      if (!bot || typeof bot !== 'object' || !('name' in bot)) {
        return;
      }
      const typedBot = bot as {
        name: BotName;
        difficulty: Difficulty;
        setupHidden?: boolean;
        vp: number;
        items: Bot['items'];
        customData?: unknown;
        rules: { isActive?: boolean }[];
      };
      if (!this.botHash[typedBot.name]) {
        console.warn(`Could not find a constructor for bot: ${typedBot.name}`);
        return;
      }

      const botRef = new this.botHash[typedBot.name]();

      botRef.difficulty = typedBot.difficulty;
      botRef.setupHidden = !!typedBot.setupHidden;
      botRef.vp = typedBot.vp;
      botRef.items = typedBot.items;
      botRef.traitHash = botRef.traitHash || {};
      botRef.customData = typedBot.customData || botRef.customData;

      for (let i = 0; i < botRef.rules.length; i++) {
        if (!typedBot.rules[i]) {
          continue;
        }
        botRef.rules[i].isActive = typedBot.rules[i].isActive;
      }

      this.generateTraitHash(botRef);
      nextBots.push(botRef);
    });
    this._bots.set(nextBots);
  }

  public async showPriorities() {
    const modal = await this.modalCtrl.create({
      component: PriorityModalComponent,
    });

    return await modal.present();
  }
}
