/**
 * Created by mafz on 16/02/2017.
 */
(function(angular) {
    'use strict';
    angular.module('app', [])
        .controller('newsController', ['newsService', '$scope', function (news, $scope) {
            $scope.bbc = null;
            $scope.cnn = null;

            $scope.lastRefresh = null;

            $scope.loadNews = function () {
                $scope.bbc = $scope.cnn = null;
                $scope.lastRefresh = new Date().toUTCString();
                news.getXmlBBC().then(function () {
                    $scope.$apply(function () {
                        $scope.bbc = news.bbc;
                    });
                });
                news.getRssCNN().then(function () {
                    $scope.$apply(function () {
                        $scope.cnn = news.cnn;
                    });
                });
            };

        }])
        .service('newsService', [function () {
            this.bbc = [];
            this.cnn = [];

            this.getXmlBBC = function () {
                var feed = this.bbc = [];
                return $.ajax({
                    url:'/bbc'
                }).done(function (data) {
                    $(data).find('item').each(function () {
                        var json = parseData(this);
                        feed.push(json);
                    });
                });
            };

            this.getRssCNN = function () {
                var feed = this.cnn = [];
                return $.ajax({
                    url:'/cnn'
                }).done(function (data) {
                    console.log(data);
                    $(data).find('item').each(function () {
                        var json = parseData(this);
                        feed.push(json);
                    });
                });
            };

            function parseData(data) {
                var json = {};
                json.title = $(data).find('title').text().replace('<![CDATA[', '').replace(']]>', '');
                json.description = $(data).find('description').text().replace('<!--[CDATA[', '').replace(']]-->', '').replace('<![CDATA[', '').replace(']]>', '').substr(0, 140);
                json.link = $(data).find('link').text();
                json.pubdate = $(data).find('pubDate').text();
                try {
                    json.media_group = $(data)[0].children[5].children[0].attributes[1].nodeValue;
                } catch(e) {}

                try {
                    json.media_thumbnail = $(data)[0].children[5].attributes[2].nodeValue;
                } catch(e) {}
                return json;
            }

        }])
})(window.angular);