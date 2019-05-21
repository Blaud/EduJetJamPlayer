import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnkiService } from './anki.service';
import { UserService } from './user.service';
import { MaterialService } from '../classes/material.service';

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  constructor(
    private http: HttpClient,
    private ankiService: AnkiService,
    private userService: UserService
  ) {}

  async getUnknownWords(subtitle: Array<any>): Promise<Array<string[]>> {
    return new Promise<Array<string[]>>(resolve => {
      const GetCardIDsByDeck = {
        action: 'findCards',
        version: 6,
        params: {
          query: `deck:${this.userService.currentUser.lastDeckName}`,
        },
      };
      let unknownWords;

      this.ankiService
        .ankiConnectRequest(
          GetCardIDsByDeck.action,
          GetCardIDsByDeck.version,
          GetCardIDsByDeck.params
        )
        .subscribe(
          async res => {
            const GetCardInfoByIDs = {
              action: 'cardsInfo',
              version: 6,
              params: {
                cards: <Array<any>>res,
              },
            };

            await this.ankiService
              .ankiConnectRequest(
                GetCardInfoByIDs.action,
                GetCardInfoByIDs.version,
                GetCardInfoByIDs.params
              )
              .subscribe(
                async res2 => {
                  let separatedSubtitleWords = [];
                  let separatedAnkiWords = [];

                  subtitle.forEach(function(caption) {
                    separatedSubtitleWords = separatedSubtitleWords.concat(
                      caption.text
                        .toLowerCase()
                        .match(/.[^\W\d](\w|[-']{1,2}(?=\w))*/g)
                    );
                  });

                  (<Array<any>>res2).forEach(function(ankiCard) {
                    // TODO: detect if word learned or not(anki card property)
                    separatedAnkiWords = separatedAnkiWords.concat(
                      // TODO: remove spaces from words left
                      // TODO: to lowercase all strings
                      ankiCard.fields.Front.value
                        .toLowerCase()
                        .match(/.[^\W\d](\w|[-']{1,2}(?=\w))*/g)
                    );
                  });
                  separatedSubtitleWords = separatedSubtitleWords.map(el =>
                    el.trim()
                  );

                  separatedSubtitleWords = Array.from(
                    new Set(separatedSubtitleWords)
                  );
                  separatedAnkiWords = Array.from(new Set(separatedAnkiWords));
                  separatedAnkiWords = separatedAnkiWords.map(el => el.trim());
                  unknownWords = separatedSubtitleWords.filter(
                    el => !separatedAnkiWords.includes(el)
                  );
                  resolve(unknownWords);
                },
                err => {
                  MaterialService.toast(err);
                  resolve([]);
                }
              );
          },
          error => {
            MaterialService.toast(error);
            resolve([]);
          }
        );
    });
  }
}
