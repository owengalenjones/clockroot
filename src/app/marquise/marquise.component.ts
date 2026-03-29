import {Component, OnInit, Input, inject} from '@angular/core';
import {MarquiseBot} from '../models/marquise';
import {BotService} from '../bot.service';
import {TranslateService, TranslatePipe} from '@ngx-translate/core';
import {MetaData, ParagraphComponent} from '../paragraph/paragraph.component';
import {IonicModule} from '@ionic/angular';
import {BotResourcesComponent} from '../bot-resources/bot-resources.component';
import {FormatPipe} from '../format.pipe';

@Component({
    selector: 'app-marquise',
    templateUrl: './marquise.component.html',
    styleUrls: ['./marquise.component.scss'],
    imports: [
        IonicModule,
        BotResourcesComponent,
        ParagraphComponent,
        TranslatePipe,
        FormatPipe
    ],
})
export class MarquiseComponent implements OnInit {
    botService = inject(BotService);
    translateService = inject(TranslateService);

    @Input() public bot!: MarquiseBot;
    public birdsongMessages: MetaData[] = [];
    public daylightMessages: MetaData[] = [];
    public eveningMessages: MetaData[] = [];

    public buildings: {
        suit: 'fox' | 'bunny' | 'mouse';
        building: 'sawmill' | 'workshop' | 'recruiter';
    }[] = [
        {suit: 'fox', building: 'sawmill'},
        {suit: 'bunny', building: 'workshop'},
        {suit: 'mouse', building: 'recruiter'},
    ];

    ngOnInit() {
        ['fox', 'bunny', 'mouse'].forEach((suit) => {
            this.bot.customData.buildings[suit] =
                this.bot.customData.buildings[suit] || [];
        });
        this.refreshTurnMessages();
    }

    private refreshTurnMessages() {
        this.birdsongMessages = this.bot.birdsong(this.translateService);
        this.daylightMessages = this.bot.daylight(this.translateService);
        this.eveningMessages = this.bot.evening(this.translateService);
    }

    toggleSetup() {
        this.botService.toggleSetup(this.bot);
        this.refreshTurnMessages();
    }

    changeDifficulty(difficulty: string) {
        this.botService.changeDifficulty(this.bot, difficulty);
        this.refreshTurnMessages();
    }

    changeSuit(suit: string) {
        this.bot.customData.currentSuit = suit;
        this.botService.saveBots();
        this.refreshTurnMessages();
    }

    toggleBuilding(suit: 'fox' | 'bunny' | 'mouse', index: number) {
        this.bot.customData.buildings[suit] =
            this.bot.customData.buildings[suit] || [];
        this.bot.customData.buildings[suit][index] =
            (this.bot.customData.buildings[suit][index] === suit)
                ? ""
                : suit;


        console.log(this.bot.customData);
        this.botService.saveBots();
        this.refreshTurnMessages();
    }
}
