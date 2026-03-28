import {Component, Input, OnInit} from '@angular/core';
import {BotService} from '../bot.service';
import {Bot} from '../models/bot';

@Component({
    selector: 'app-riverfolk-services',
    templateUrl: './riverfolk-services.component.html',
    styleUrls: ['./riverfolk-services.component.scss'],
})
export class RiverfolkServicesComponent implements OnInit {
    @Input() protected botService: BotService;
    @Input() protected bot: Bot;

    ngOnInit(): void {
    }

}
