
  Number.prototype.toHHMMSS = function () {
      var sec_num = parseInt(this, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
  }
    $(function(){

      Handlebars.registerHelper('eq', function (a, b, options) {
          return a === b ? options.fn(this) : options.inverse(this);
        });


      var util = {
        store: function (namespace, data) {
          if (arguments.length > 1) {
            return localStorage.setItem(namespace, JSON.stringify(data));
          } else {
            var store = localStorage.getItem(namespace);
            return (store && JSON.parse(store)) || { count: { totalCalls:0, totalContacted:0, totalTransfers: 0}, totalCount: { totalCalls: 0, totalContacted: 0, totalTransfers: 0}, isReset: false};
          }
        }
      };

      var App = {
        init: function() {
          // this.count = {
          //   totalCalls: 0,
          //   totalContacted: 0,
          //   totalTransfers: 0
          // };
          // this.totalCount = {
          //   totalCalls: 0,
          //   totalContacted: 0,
          //   totalTransfers: 0
          // }

          var store = util.store('call-count');

          console.log(store);
          this.goal = 0;
          this.goalStarted = false;
          this.alertTemplate = Handlebars.compile($('#alert-template').html());
          this.time = 3600;
          this.count = store.count;
          this.totalCount = store.totalCount;

          this.percent = 0;
          this.totalPercent = 0;

          this.isReset = store.isReset;

          this.bindEvents();
          // this.updatePercent();
          this.render();
        },
        bindEvents: function() {
          $('.call-btn').on('click', this.updateCount.bind(this));
          $('#btnReset').on('click', this.stopGoal.bind(this));
          $('#btnReset').on('click', this.reset.bind(this));

          $('#btnResetAll').on('click', this.resetAll.bind(this));
          $('#startGoal').on('click', this.startGoal.bind(this));
          $('#goal').on('keyup', this.setGoal.bind(this));
          // $('#stopGoal').on('click', this.stopGoal.bind(this));
          // this.time.on('change', this.updateTime.bind(this));
        },
        setGoal: function(e) {
            var $input = $(e.target);
            var val = $input.val().trim();


            this.goal = val;

            console.log(this.goal)
        },
        startTimer: function() {
          if(this.time == 0) {
            this.stopGoal();
          } else {
            this.time = this.time-1;
            $('#timer').html(this.time.toHHMMSS());

          }
        },
        updateTime: function() {


        },
        startGoal: function() {
          if(!this.goal) {
            return
          }

          $('#startGoal').prop({disabled: true})

          // this.stopGoal();

          this.time = 3600
          this.goalStarted = true;

          console.log(this.time)
          this.timer = setInterval(this.startTimer.bind(this), 1000);
        },
        alert: function() {
          if(this.goal <= this.count.totalTransfers) {
            $('.goal-alert').html(this.alertTemplate({success: true}))
          } else {
            $('.goal-alert').html(this.alertTemplate({success: false}))
          }
        },
        stopGoal: function() {
          $('#startGoal').prop('disabled', false);
          this.alert();
        },
        updateCount: function(e) {
          var x = $(e.target).attr('name');

          console.log(x);

          if(x == 'transfer') {
            this.count.totalTransfers += 1;
            this.totalCount.totalTransfers += 1;

            this.count.totalContacted += 1;
            this.totalCount.totalContacted += 1;
          } else if(x == 'contacted') {
            this.count.totalContacted += 1;
            this.totalCount.totalContacted +=1;
          }
          this.count.totalCalls += 1;
          this.totalCount.totalCalls += 1;
          // this.updatePercent();
          this.render();
        },
        updatePercent: function() {

          if(this.count.totalCalls) {
            this.percent = (this.count.totalTransfers/this.count.totalCalls*100).toFixed(2);
          } else {
            this.percent = 0;
          }
          if(this.totalCount.totalCalls) {
            this.totalPercent = (this.totalCount.totalTransfers/this.totalCount.totalCalls*100).toFixed(2);
          } else {
            this.totalPercent = 0;
          }


        },
        render: function() {
          this.updatePercent();

          $('#transferDisp').html(this.count.totalTransfers);
          $('#contactedDisp').html(this.count.totalContacted);
          $('#totalDisp').html(this.count.totalCalls);
          $('#percentageDisp').html(this.percent);

          $('#tTransferDisp').html(this.totalCount.totalTransfers);
          $('#tContactedDisp').html(this.totalCount.totalContacted);
          $('#tTotalDisp').html(this.totalCount.totalCalls);
          $('#tPercentageDisp').html(this.totalPercent);

          if(this.isReset) {
            this.renderTotals();
          }

          util.store('call-count', {count: this.count, totalCount: this.totalCount, isReset: this.isReset});

        },
        renderTotals: function() {
            $('#totalRow').addClass('visible');
        },
        reset: function() {
          if (!this.isReset) {
            this.isReset = true;
            this.renderTotals()
          }


          this.count = {
            totalCalls: 0,
            totalContacted: 0,
            totalTransfers: 0
          };

          this.timer = clearInterval(this.timer);
          this.render();

        },
        resetAll: function() {
          this.count = {
            totalCalls: 0,
            totalContacted: 0,
            totalTransfers: 0
          };
          this.totalCount = {
            totalCalls: 0,
            totalContacted: 0,
            totalTransfers: 0
          };
          this.isReset = false;
          this.render();
        }
      }

      App.init();
  });
