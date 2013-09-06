/*jslint nomen: true, plusplus: true */
/*global define, $, Handlebars, alert, _ */

define(['backbone', 'moontemplate'], function(Backbone, moontemplate) {'use strict';

    return Backbone.View.extend({

        events : {
        },

        /**
         * @function
         * @param {Object} obj
         */
        render : function(obj) {
            var self = this, i;
            // Default the width and height
            obj.template.width = obj.template.width || '100%';
            obj.template.height = obj.template.height || '100%';
            console.log('V. 5/8&14:00');

            this.template = obj.template;
            this.data = obj.data;
            this.options = obj.template.options;
            //this.$el.moontemplate(obj.template, obj.data);
            this.createPuzzle(this.options);
            $('.puzzle').css(self.options.styles.puzzle)
            $('#get_started').css(self.options.styles.backgrounCover)
            $('.puzzleImg').css(self.options.styles.puzzleImg)
            if(/windows phone|Tablet PC|android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) ||  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)) || userAgent.indexOf('iPad') !== -1 || userAgent.indexOf('iPod') !== -1){
    $('body').css({'font-size': '300%', 'line-height': '1.5em'});
}else{
    var isMobile = false;
}

if(!(/Android/i).test(userAgent)){
    sizeApp();
}

function sizeApp(){
    if(window.innerHeight < window.innerWidth){
        $('body').css('height', $(window).innerWidth() + 100);
    }else{
        $('body').css('height', $(window).innerHeight());
    }
}

function resizeApp(){
    if(window.innerHeight < window.innerWidth){
        $('body').stop().animate({
            height: $(window).innerWidth() + 100
        }, 50, function() {
            // Animation complete.
        });
    }else{
        $('body').stop().animate({
            height: $(window).innerHeight()
        }, 50, function() {
            // Animation complete.
        });
    }
}
            // Run the widget through MoonTemplate
        },
        createPuzzle : function() {
            var view = this;
            var styleSolution = this.createElements();
            var draggedElement = null;
            var draggedOver = null;
            var changeElement = null;
            var puzzle = this;

            $.fn.draggable = function() {
                var self=this;
                var offset = null;
                var positionsTop = new Array();
                var positionsLeft = new Array();
                var getHeight = new Array();
                var getWidth = new Array();
                var style = "";
                var start = function(e) {
                    console.log('start');
                    e.preventDefault();
                    style = $(this).attr('style');
                    $(this).css('z-index', '11');

                    for (var i = 0; i < $(".puzzle").length; i++) {
                        if(typeof $("#puzzle" + (i + 1)).offset() != 'undefined'){
                            positionsTop[i] = $("#puzzle" + (i + 1)).offset().top;
                            positionsLeft[i] = $("#puzzle" + (i + 1)).offset().left;
                            getHeight[i] = parseInt($("#puzzle" + (i + 1)).css('height').replace('px', ''));
                            getWidth[i] = parseInt($("#puzzle" + (i + 1)).css('width').replace('px', ''));
                        }
                    }

                    var orig = e.originalEvent;
                    var pos = $(this).position();
                    offset = {
                        x : orig.changedTouches[0].pageX - pos.left,
                        y : orig.changedTouches[0].pageY - pos.top
                    };

                    //e.preventDefault();
                    this.style.opacity = '1';
                    $(this).css('background-color', 'orange')
                    draggedElement = this;
                    var clonedPiece = $(this).clone();
                    clonedPiece.attr('id', "clonedPiece")
                    clonedPiece.css('z-index', '11')
                    $(this).parent().append(clonedPiece);
                    var id = $(this).attr('id').split('puzzle').join('');
                    $('body').trigger('dite', {
                        screenName: 'quiz/jumble/'+id,
                        eventName: 'clickDragStart',
                        eventData: undefined
                    });
                };
                var move = function(e) {
                    console.log('move');
                    e.preventDefault();
                    var orig = e.originalEvent;
                    $(this).css({
                        "z-index" : "12"
                    })
                    $(this).css({
                        top : orig.changedTouches[0].pageY - offset.y,
                        left : orig.changedTouches[0].pageX - offset.x
                    });
                    //console.log(orig.changedTouches[0].pageY)
                    var top = $(this).offset().top;
                    var left = $(this).offset().left;
                    //console.log( positionsTop.length )
                    for (var i = 0; i < positionsTop.length; i++) {
                        if ($(this).offset().top > positionsTop[i] && $(this).offset().top < (positionsTop[i] + getHeight[i]) && $(this).offset().left > positionsLeft[i] && $(this).offset().left < (positionsLeft[i] + getWidth[i])) {
                            $('.puzzle')[i].style.background = "orange";
                            $('.puzzle img')[i].style.opacity = "0.4"
                        } else {
                            $('.puzzle img')[i].style.opacity = "1"
                            $('.puzzle')[i].style.background = "white";
                        }
                    }

                    $('.puzzle img').css({
                        "z-index" : "3"
                    })
                    $(this).css({
                        "z-index" : "12"
                    })
                    this.style.opacity = '0.5';

                };

                var end = function(e) {
                    $("#clonedPiece").remove()
                    var top = $(this).offset().top;
                    var left = $(this).offset().left;
                    var change=false;
                    for (var i = 0; i < positionsTop.length; i++) {
                        if ($(this).offset().top > positionsTop[i] && $(this).offset().top < (positionsTop[i] + getHeight[i]) && $(this).offset().left > positionsLeft[i] && $(this).offset().left < (positionsLeft[i] + getWidth[i])) {
                            $(this).attr('style', $('.puzzle')[i].getAttribute('style'))
                            $('.puzzle')[i].setAttribute('style', style)
                            $('.puzzle img').css('opacity', '1')
                            change=true;
                        }
                    }

                    if(change==false)
                        $(this).attr('style', style)
                    view.testSolution(styleSolution);
                };
                if( isMobile ){
                    this.bind("touchstart", start);
                    this.bind("touchmove", move);
                    this.bind("touchend", end);
                    this.bind("touchcancel", end);
                }

            };

            $(".puzzle").draggable();
             $('.puzzle img').on('dragstart',function(event){
                console.log("DRAGGGGG")
                this.style.opacity='1';
                $(this).css('border','2px solid orange')
                draggedElement=this;
                var id = $(this).attr('id').split('puzzle').join('');
                $('body').trigger('dite', {
                    screenName: 'quiz/jumble/'+id,
                    eventName: 'clickDragStart',
                    eventData: undefined
                });

             });
             $('.puzzle').off('dragover');
             $('.puzzle img').on('dragover',function(event){
                $('.puzzle').css({"background-color":"white"})
                $('.puzzle img').css({"opacity":"1"})
                draggedOver=this;
                $(this).parent().css({"background-color":"orange"})
                this.style.opacity='0.5';
                changeElement={"imgSrc":$(this).attr('src'),"id":$(this).attr('id')};

             });

             $('.puzzle img').on('dragend',function(event){
                $('.puzzle').css({"background-color":"white"})
                $('.puzzle img').css({"border":"none"})
                $(draggedOver).attr('src',$(draggedElement).attr('src'))
                $(draggedOver).attr('id',$(draggedElement).attr('id'))
                $(draggedOver).css({
                    'opacity':1
                })
                $(draggedElement).attr('src',changeElement.imgSrc)
                $(draggedElement).attr('id',changeElement.id)
                $(draggedElement).css({
                    'opacity':1
                })
                puzzle.testSolutionHtml();
             });

        },
        createElements : function() {
            var html = '';
            var top = 0;
            var left = 0;
            for (var i = 0; i < (this.options.columns * this.options.rows); i++) {
                if (left == this.options.columns)
                    left = 0;
                html += '<div id="puzzle' + (i + 1) + '" class="puzzle" draggable="true" style="margin-left:' + this.getValues().width * left + '%;' + 'width:' + this.getValues().width + '%;height:' + this.getValues().height + '%;top:' + this.getValues().height * top + '%;);" ><img id="puzzle' + (i + 1) + '" class="puzzleImg" src="' + this.options.images[i] + '"></div>';
                left++;
                if ((i + 1) % this.options.columns == 0)
                    top++;
            }
            $('#puzzle_container').append(html);
            var style = new Array();
            for (var j = 0; j < $('.puzzle').length; j++) {
                style[j] = {
                    'width' : $('.puzzle')[j].style.width,
                    'top' : $('.puzzle')[j].style.top,
                    'marginLeft' : $('.puzzle')[j].style.marginLeft,
                    'id' : $('.puzzle')[j].getAttribute('id')
                };
            }
            return style;

        },
        getValues : function() {
            var columns = 100 / this.options.columns;
            var rows = 100 / this.options.rows;
            return {
                "width" : columns,
                "height" : rows
            }
        },
        testSolution : function(styleSolution) {
            var solution = new Array();
            var result = false;
            for (var i = 0; i < $('.puzzle').length; i++) {
                solution[i] = $('.puzzle')[i].getAttribute("style");
            }
            var arraySolution = this.options.solution.split(',');
            for (var j = 0; j < arraySolution.length; j++) {

                if (styleSolution[j].width == $('#puzzle'+arraySolution[j])[0].style.width && styleSolution[j].top == $('#puzzle'+arraySolution[j])[0].style.top && styleSolution[j].marginLeft == $('#puzzle'+arraySolution[j])[0].style.marginLeft) {
                    result = true;
                } else {
                    result = false
                    return false;
                }

            }
            if (result == true){
                var self=this;
                $('#video_app').css('background', '#e7f8ff');
                $('.percentage-text .number').html((window.plugPercentage+10))
                $('.percentage-bar').css({'right': (parseInt($('.percentage-bar')[0].style.right.replace('%',''))+4)+'%'});
                $('body').trigger('dite', {
                    screenName: 'quiz/jumble',
                    eventName: 'completed',
                    eventData: undefined
                });
                setTimeout(function(){
                    $('body').trigger('moontemplate:link', {
                data: {},
                template: {
                    click: self.options.whenFinish
                    }
                });
                },1000)

                }

        },
        testSolutionHtml:function(){
            var self=this;
            var solution="";
            for(var i=0;i<$('.puzzle').length;i++){
                solution += $('.puzzle img')[i].getAttribute("id").replace("puzzle","");
            }
            console.log("testSolutionHtml");
            if(this.options.solution.replace(/,/g,"")==solution){
                $('.percentage-text .number').html((window.plugPercentage+10))
                $('.percentage-bar').css({'right': (parseInt($('.percentage-bar')[0].style.right.replace('%',''))+4)+'%'});
                $('body').trigger('dite', {
                    screenName: 'quiz/jumble',
                    eventName: 'completed',
                    eventData: undefined
                });
                setTimeout(function(){
                $('body').trigger('moontemplate:link', {
                    data: {},
                    template: {
                        click: self.options.whenFinish
                    }
                });
                },1000)
            }
        }
    });

});
