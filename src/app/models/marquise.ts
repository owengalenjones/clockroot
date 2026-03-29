import { TranslateService } from '@ngx-translate/core';
import { Bot, BotName } from './bot';
import { BotService } from '../bot.service';
import {translate} from "@angular/localize/tools";

export class MarquiseBot extends Bot {
  public name: BotName = 'Marquise';

  public setupPosition = 'A';
  public setupRules = ['Setup0', 'Setup1', 'Setup2', 'Setup3', 'Setup4'];

  public difficultyDescriptions = {
    Easy: `Easy`,
    Normal: 'Normal',
    Challenging: `Challenging`,
    Nightmare: `Nightmare`,
  };

  public rules = [
    {
      traitName: 'Poor Manual Dexterity',
      name: 'RulePoorManualDexterity',
      text: `TextPoorManualDexterity`,
      isActive: true,
    },
    {
      traitName: 'Hates Surprises',
      name: 'RuleHatesSurprises',
      text: 'TextHatesSurprises',
      isActive: true,
    },
    {
      traitName: 'The Keep',
      name: 'RuleTheKeep',
      text: 'TextTheKeep',
      isActive: true,
    },
    {
      traitName: 'Blitz',
      name: 'RuleBlitz',
      text: 'TextBlitz',
      canToggle: true,
    },
    {
      traitName: 'Fortified',
      name: 'RuleFortified',
      text: `TextFortified`,
      canToggle: true,
    },
    {
      traitName: 'Hospitals',
      name: 'RuleHospitals',
      text: `TextHospitals`,
      canToggle: true,
    },
    {
      traitName: 'Iron Will',
      name: 'RuleIronWill',
      text: 'TextIronWill',
      canToggle: true,
    },
    {
      traitName: 'Overwhelming',
      name: 'RuleOverwhelming',
      text: 'TextOverwhelming',
      canToggle: true,
    },
  ];

  public buildings: {[key: string]: string[]} = {
    fox: [],
    bunny: [],
    mouse: [],
  }

  public customData = {
    currentSuit: 'bird',

    buildings: this.buildings
  };

  private isChallenging: boolean = false;
  private warriorsToRecruit: number = 2;
  private isOverwhelming: boolean = false;
  private isBlitz: boolean = false;
  private isIronWill: boolean = false;

  public setup(): void {}

  public birdsong(translate: TranslateService) {
    this.isChallenging = this.difficulty === 'Challenging';
    this.warriorsToRecruit = this.difficulty === 'Easy' ? 2 : 4;
    this.isOverwhelming = this.hasTrait('Overwhelming');
    this.isBlitz = this.hasTrait('Blitz');
    this.isIronWill = this.hasTrait('Iron Will');

    return [
      this.createMetaData(
        'text',
        '',
        translate.instant(`SpecificBirdsong.Mechanical Marquise.RevealOrder`),
      ),
      this.createMetaData(
        'score',
        1,
        translate.instant(`SpecificBirdsong.Mechanical Marquise.CraftOrder`),
      ),
    ];
  }

  private escalatedDaylight(translate: TranslateService) {
    const actualRecruit = this.isIronWill
      ? this.warriorsToRecruit * 2
      : this.warriorsToRecruit;

    return [
      this.createMetaData(
        'text',
        '',
        translate.instant(`SpecificDaylight.Mechanical Marquise.Bird0`),
      ),
      this.isOverwhelming
        ? this.createMetaData(
            'text',
            '',
            translate.instant(
              `SpecificDaylight.Mechanical Marquise.Bird1Overwhelming`,
              {
                splitWarriorsToRecruit: actualRecruit / 2,
                totalWarriorsToRecruit: actualRecruit,
              },
            ),
          )
        : this.createMetaData(
            'text',
            '',
            translate.instant(`SpecificDaylight.Mechanical Marquise.Bird1`, {
              splitWarriorsToRecruit: actualRecruit / 2,
              totalWarriorsToRecruit: actualRecruit,
            }),
          ),
      this.isChallenging
        ? this.createMetaData(
            'text',
            '',
            translate.instant(
              `SpecificDaylight.Mechanical Marquise.BirdChallenging`,
            ),
          )
        : this.createEmptyText(),
      this.createMetaData(
        'text',
        '',
        translate.instant(`SpecificDaylight.Mechanical Marquise.Bird2`),
      ),
      this.createMetaData(
        'text',
        '',
        translate.instant(`SpecificDaylight.Mechanical Marquise.Bird3`),
      ),
      this.isBlitz
        ? this.createMetaData(
            'text',
            '',
            translate.instant(`SpecificDaylight.Mechanical Marquise.Blitz`),
          )
        : this.createEmptyText(),
    ];
  }

  public daylight(translate: TranslateService) {
    const suit = this.customData.currentSuit;

    if (this.customData.currentSuit === 'bird') {
      return this.escalatedDaylight(translate);
    }

    let building = '';
    if (this.customData.currentSuit === 'fox') {
      building = 'sawmill';
    }
    if (this.customData.currentSuit === 'bunny') {
      building = 'workshop';
    }
    if (this.customData.currentSuit === 'mouse') {
      building = 'recruiter';
    }

    return [
      this.createMetaData(
        'text',
        '',
        translate.instant(`SpecificDaylight.Mechanical Marquise.Suit0`, {
          suit,
        }),
      ),
      this.isOverwhelming
        ? this.createMetaData(
            'score',
            1,
            translate.instant(
              `SpecificDaylight.Mechanical Marquise.Suit1Overwhelming`,
              {
                totalWarriorsToRecruit: this.warriorsToRecruit,
                suit,
              },
            ),
          )
        : this.createMetaData(
            'text',
            '',
            translate.instant(`SpecificDaylight.Mechanical Marquise.Suit1`, {
              totalWarriorsToRecruit: this.warriorsToRecruit,
              suit,
            }),
          ),
      this.isChallenging
        ? this.createMetaData(
            'text',
            '',
            translate.instant(
              `SpecificDaylight.Mechanical Marquise.SuitChallenging`,
              { suit },
            ),
          )
        : this.createEmptyText(),
      this.createMetaData(
        'text',
        '',
        translate.instant(`SpecificDaylight.Mechanical Marquise.Suit2`, {
          building,
        }),
      ),
      this.createMetaData(
        'text',
        '',
        translate.instant(`SpecificDaylight.Mechanical Marquise.Suit3`, {
          suit,
        }),
      ),
      this.isBlitz
        ? this.createMetaData(
            'text',
            '',
            translate.instant(`SpecificDaylight.Mechanical Marquise.Blitz`),
          )
        : this.createEmptyText(),
      this.isOverwhelming
        ? this.createMetaData(
            'text',
            '',
            translate.instant(
              `SpecificDaylight.Mechanical Marquise.RepeatOverwhelming`,
            ),
          )
        : this.createMetaData(
            'text',
            '',
            translate.instant(`SpecificDaylight.Mechanical Marquise.Repeat`),
          ),
    ];
  }

  public evening(translate: TranslateService) {
    const buildings: {[key: string]: string[]} = this.customData.buildings;
    const isNightmare = this.difficulty === 'Nightmare';

    if (this.customData.currentSuit === 'bird') {
      return this.eveningBird(translate, buildings, isNightmare);
    }

    const buildingsOfSuit: string[] = buildings[this.customData.currentSuit];

    const score = Math.max(
      0,
      buildingsOfSuit.reduce((prev, cur) => prev + (cur ? 1 : 0), 0) - 1,
    );

    return [
      isNightmare
        ? this.createMetaData(
            'score',
            1,
            translate.instant(
              'SpecificEvening.Mechanical Marquise.NightmareScore',
            ),
          )
        : this.createMetaData(
            'score',
            score,
            translate.instant('SpecificEvening.Mechanical Marquise.Score'),
          ),
      this.createMetaData(
        'text',
        '',
        translate.instant('SpecificEvening.Mechanical Marquise.Discard'),
      ),
    ];
  }

  private eveningBird(
    translate: TranslateService,
    buildings: { [key: string]: string[] },
    isNightmare: boolean,
  ) {
    const scores = ['fox', 'mouse', 'bunny'].map((suit) => {
      return buildings[suit].reduce((prev, cur) => prev + (cur ? 1 : 0), 0) - 1;
    });

    const maxScore = Math.max(...scores, 0);

    return [
      isNightmare
        ? this.createMetaData(
            'score',
            1,
            translate.instant(
              'SpecificEvening.Mechanical Marquise.NightmareScore',
            ),
          )
        : this.createMetaData(
            'score',
            maxScore,
            translate.instant('SpecificEvening.Mechanical Marquise.Score', {
              score: maxScore,
            }),
          ),
      this.createMetaData(
        'text',
        '',
        translate.instant('SpecificEvening.Mechanical Marquise.Discard'),
      ),
    ];
  }
}
