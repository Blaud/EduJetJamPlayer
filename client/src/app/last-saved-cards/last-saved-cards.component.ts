import { Component, OnInit } from '@angular/core';
import { SimpleCard } from '../shared/interfaces';
import { AnkiService } from '../shared/services/anki.service';
import { MaterialService } from '../shared/classes/material.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-last-saved-cards',
  templateUrl: './last-saved-cards.component.html',
  styleUrls: ['./last-saved-cards.component.css'],
})
export class LastSavedCardsComponent implements OnInit {
  lastSavedCards$: Observable<SimpleCard[]>;

  constructor(private ankiService: AnkiService) {}

  ngOnInit() {
    this.loadLastCards();
    this.ankiService.cardsChangedEvent.subscribe(value => {
      if (value === true) {
        this.loadLastCards();
        // should put focus() on input
      }
    });
  }

  loadLastCards() {
    const GetCardIDsByDeck = {
      action: 'findCards',
      version: 6,
      params: {
        query: 'deck:English',
      },
    };

    this.ankiService
      .ankiConnectRequest(
        GetCardIDsByDeck.action,
        GetCardIDsByDeck.version,
        GetCardIDsByDeck.params
      )
      .subscribe(
        res => {
          const GetCardInfoByIDs = {
            action: 'cardsInfo',
            version: 6,
            params: {
              cards: (<Array<any>>res)
                // TODO: fit number of cards to page size
                .slice(
                  Math.max((<Array<any>>res).length - 10, 0),
                  (<Array<any>>res).length
                )
                .reverse(),
            },
          };
          this.lastSavedCards$ = <any>(
            this.ankiService.ankiConnectRequest(
              GetCardInfoByIDs.action,
              GetCardInfoByIDs.version,
              GetCardInfoByIDs.params
            )
          );
        },
        error => {
          MaterialService.toast(error);
        }
      );
  }

  deleteCard(event, card: SimpleCard) {
    const deleteRequest = {
      action: 'deleteNotes',
      version: 6,
      params: {
        notes: [card.note],
      },
    };

    this.ankiService
      .ankiConnectRequest(
        deleteRequest.action,
        deleteRequest.version,
        deleteRequest.params
      )
      .subscribe(
        // TODO: better error catcher (now it throws only error responce, but still works)
        res => {
          MaterialService.toast('Card deleted!');
          this.ankiService.cardsChanged();
        },
        error => {
          MaterialService.toast('Card deleted! ' + (error || ''));
          this.ankiService.cardsChanged();
        }
      );
  }
}
