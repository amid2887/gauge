require(['./config'], function(){
    require(['jquery-gauge', 'gauge'], function($, Gauge){
    
        var config = {
            width: 440,
            height: 440,
            value: -50,
            arc: {
                angles: [-210, -30, 10, 30],
                lineWidth: 3,
                radius: 180,
                strokeStyles: ['#666', '#ffa500', 'red']
            },
            needle: {
                width: 4,
                radius: 190,
                fillStyle: '#1e98e4'
            },
            pointer: {
                radius: 9,
                fillStyle: '#1e98e4'
            },
            hashes: {
                values: [0, 1, 2, 3, 4, 5, 6],
                marks: 10,
                marksSize: 1,
                radius: 180,
                radiusOffset: 10,
                height: 6,
                fillStyle: '#8c8c8c',
                strokeStyle: '#8c8c8c',
                lineWidth: 1,
                lineCap: 'square',
                position: 'outset'
            },
            font: '14px Arial, sans-serif',
            textAlign: 'center',
            textBaseline: 'middle'
        };

        var App = {
            js: new Gauge('gauge', config),
            jq: $('#jquery-gauge').gauge(config)
        };

        function configs() {
            return [
                {
                    pointer: {
                        radius: rand(4, 10),
                        fillStyle: randCol()
                    }
                },
                {
                    value: rand(-180, 180)
                },
                {
                    arc: {
                        angles: (function (i) {
                            var res = [rand(-215, -181), rand(-180, -150), rand(-159, -100), rand(-99, 0), rand(1, 60)]
                            res.length = i;
                            return res;
                        })(rand(3, 5)),
                        lineWidth: rand(2, 5),
                        strokeStyles: (function (i) {
                            var res = [],
                                j = 10;
                            while (j--) {
                                res.push(randCol());
                            }
                            return res;
                        })()
                    }
                },
                {
                    hashes: {
                        values: (function(i){
                            if (i === 0) {
                                return 'JavaScript'.split('');
                            }
                            else {
                                return (function(j){
                                    var res = [];
                                    for (var z = Math.min(i, j); z <= Math.max(i,j); z++) {
                                        res.push(z);
                                    }
                                    return res;
                                })(rand(1, 4))
                            }
                        })(rand(0,10)),
                        marks: rand(0, 25)
                    }
                },
                {
                    hashes: {
                        position: (function(i){i===0?'inset':''})(rand(0, 10))
                    }
                }
            ];
        }

        function rand(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }

        function randCol() {
            return '#'+Math.floor(Math.random()*16777215).toString(16);
        }

        function getRandomConfig() {
            var res = configs();
            return $.extend(true, {}, res[rand(0, res.length - 1)], res[rand(0, res.length - 1)], res[rand(0, res.length - 1)]);
        }

        App.random = function () {
            App.js.redraw(getRandomConfig());
            App.jq.data('gauge').redraw(getRandomConfig());
        };

        window.App = App;
    });
});