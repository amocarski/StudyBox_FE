/**
 * INSTRUKCJA OBSŁUGI
 *
 * getDecks() - zwraca wszystkie talie (obiekty typu Deck)
 * createNewDeck(name) - tworzy (na serwerze) nową talię
 *
 * Deck [klasa]:
 *  > pola:
 *  id - identyfikator talii, ustalany przez serwer
 *  name - nazwa talii
 *
 *  > metody (wszystkie zwracają promise):
 *  getFlashcards() - zwraca listę fiszek dla danej talii
 *  createFlashcard(question, answer) - tworzy nową fiszkę
 *  updateFlashcard(id, question, answer) - uaktualnia fiszkę o wskazanym id
 *  removeFlashcard(id) - usuwa fiszkę
 *  changename(name) - zmienia nazwę talii
 */

(function() {
  'use strict';
  angular
  .module('backend')
  .service('BackendService', BackendService);

  /** @ngInject */
  function BackendService($http) {

    this.getDecks = getDecks;
    this.createNewDeck = createNewDeck;

    this.Deck = Deck;  // class

    /* *** */

    function getDecks() {
      var method = 'GET';
      var url = 'http://private-anon-0160c33ac-studybox.apiary-mock.com/decks';

      return promiseWithDecks(method, url);
    }

    function promiseWithDecks(method, url) {
      var promise = $http({method: method, url: url})
      .then(
        function success(response) {
          return jsonToDecks(response);
        },
        function error(response) {
          return response;
        }
      );

      function jsonToDecks(response) {
        var decks = [];
        for(var i = 0; i < response.data.length; i++) {
          var deck = new Deck(response.data[i].name);
          deck.id = response.data[i].id;
          decks.push(deck);
        }
        return decks;
      }

      return promise;
    }

    function createNewDeck(name) {
      var method = 'POST';
      var url = 'http://private-anon-0160c33ac-studybox.apiary-mock.com/decks';
      var data = {name: name};

      return newDeckPromise(method, url, data);
    }

    function newDeckPromise(method, url, data) {
      var promise = $http({method: method, url: url, data: data})
      .then(
        function success(response) {
          var deck = new Deck(response.data.name);
          deck.id = response.data.id;
          return deck;
        },
        function error(response) {
          return response;
        }
      );
      return promise;
    }

    function Deck(name) {
      this.id = null;
      this.name = name;

      this.getFlashcards = getFlashcards;
      this.createFlashcard = createFlashcard;
      this.updateFlashcard = updateFlashcard;
      this.removeFlashcard = removeFlashcard;
      this.changeName = changeName;

      function getFlashcards() {
        var method = 'GET';
        var url = "http://private-anon-0160c33ac-studybox.apiary-mock.com/decks/";
        /*jshint validthis:true */
        url += this.id + "/flashcards";
        var data = {};

        return simplePromise(method, url, data);
      }

      function createFlashcard(question, answer) {
        var method = 'POST';
        var url = 'http://private-anon-0160c33ac-studybox.apiary-mock.com/decks/';
        /*jshint validthis:true */
        url += this.id + '/flashcards';
        var data = {question: question, answer: answer};

        return simplePromise(method, url, data);
      }

      function updateFlashcard(id, question, answer) {
        var method = 'PUT';
        var url = 'http://private-anon-0160c33ac-studybox.apiary-mock.com/decks/';
        /*jshint validthis:true */
        url += this.id + '/flashcards/';
        url += id;

        var data = {question: question, answer: answer};

        return simplePromise(method, url, data);
      }

      function removeFlashcard(id) {
        var method = 'DELETE';
        var url = 'http://private-anon-0160c33ac-studybox.apiary-mock.com/decks/';
        /*jshint validthis:true */
        url += this.id + '/flashcards/';
        url += id;
        var data = {};

        return simplePromise(method, url, data);
      }

      function changeName(new_name) {
        var method = 'PUT';
        var url = 'http://private-anon-0160c33ac-studybox.apiary-mock.com/decks/';
        /*jshint validthis:true */
        url += this.id;
        var data = {id: this.id, name: new_name};
        var $this = this;

        var promise = $http({method: method, url: url, data: data})
        .then(
          function success(response) {
            $this.name = response.data.name;
            return response.data;
          },
          function error(response) {
            return response.data.message;
          }
        );

        return promise;
      }
    }

    function simplePromise(method, url, data) {
      return $http({method: method, url: url, data: data})
      .then(
        function success(response) {
          return response.data;
        },
        function error(response) {
          return response.data.message;
        }
      );
    }
  }

})();
