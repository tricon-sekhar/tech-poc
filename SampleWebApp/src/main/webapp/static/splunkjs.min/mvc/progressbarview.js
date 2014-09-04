define("splunkjs/mvc/progressbarview",["require","exports","module","jquery","./mvc","backbone","./basesplunkview","underscore","views/shared/delegates/Popdown","splunk.util","splunk.config"],function(e,t,n){var r=e("jquery"),i=e("./mvc"),s=e("backbone"),o=e("./basesplunkview"),u=e("underscore"),a=e("views/shared/delegates/Popdown"),f=e("splunk.util"),l=e("splunk.config"),c=window.devicePixelRatio>1?"progress@2x.gif":"progress.gif",h=l.INDEPENDENT_MODE?e.toUrl("")+"./splunkjs.min/css/img/splunk/"+c:f.make_url("/static/img/splunk/"+c),p=o.extend({moduleId:n.id,className:"splunk-progressbar",configure:function(){this.options.manager&&(this.options.managerid=this.options.manager),o.prototype.configure.apply(this,arguments)},initialize:function(){this.configure(),this.children||(this.children={}),this.bindToComponentSetting("managerid",this.onManagerChange,this),this.model={jobState:new s.Model,messages:new s.Model};var e=u.debounce(this.render);this.model.jobState.on("change",e,this),this.model.messages.on("change",e,this)},onManagerChange:function(e,t){this.manager&&this.manager.off(null,null,this),this.manager=t;if(!t)return;this.model.jobState.clear(),this.model.messages.clear(),this.manager.on("search:start",this.onSearchStart,this),this.manager.on("search:progress",this.onSearchProgress,this),this.manager.on("search:error",this.onSearchFail,this),this.manager.on("search:fail",this.onSearchFail,this),this.manager.on("search:cancelled",this.onSearchCancelled,this),this.manager.replayLastSearchEvent(this)},onSearchStart:function(){this.model.messages.clear(),this.model.jobState.set({text:"",progress:0,active:!0})},onSearchProgress:function(e){var t=e.content||{},n=t.dispatchState;this.model.jobState.set({realTime:t.isRealTimeSearch});if(t.messages){var r=u(t.messages).chain().where({type:"ERROR"}).pluck("text").value(),i=u(t.messages).chain().where({type:"WARN"}).pluck("text").value();this.model.messages.set("errors",r,{unset:u.isEmpty(r)}),this.model.messages.set("warnings",i,{unset:u.isEmpty(i)})}if(n===undefined)this.model.jobState.clear();else if(n==="FAILED")this.model.jobState.clear();else{var s=t.doneProgress,o,a,f=!0;u.isNumber(s)&&!u.isNaN(s)&&(o=String(Math.floor(s*100)));var l=u("Loading").t();f=!0,a=[l," - ",o+"%"].join(""),t.dispatchState==="PAUSED"?(a=u("Paused").t(),f=!1):f=!0,t.dispatchState==="DONE"?this.model.jobState.clear():this.model.jobState.set({text:a,progress:o,active:f})}},onSearchFail:function(){this.model.jobState.clear()},onSearchCancelled:function(){this.model.jobState.clear()},render:function(){return this.model.jobState.has("progress")&&this.model.jobState.get("realTime")!==!0?(this.$progress||(this.$progress=r('<div class="progress-bar"><div class="progress-msg"></div><div class="progress"><div class="bar" style="width: 0%"></div></div></div>').appendTo(this.el),r("<img/>").attr("src",h).appendTo(this.$progress.find(".bar"))),this.$(".progress-msg").text(this.model.jobState.get("text")),this.$(".progress").find(".bar").width((this.model.jobState.get("progress")||0)+"%")):this.$progress&&(this.$progress.remove(),this.$progress=null),this.model.messages.has("errors")||this.model.messages.has("warnings")?(this.$error||(this.$error=r('<div class="error-details"><a href="#" class="dropdown-toggle error-indicator"><i class="icon-warning-sign"></i></a><div class="dropdown-menu"><div class="arrow"></div><ul class="first-group error-list"></ul></div></div>').appendTo(this.$el)),this.$error.find(".error-list").html(this.errorStatusTemplate(u.extend({_:u,errors:null,warnings:null},this.model.messages.toJSON()))),this.children.errorPopdown||(this.children.errorPopdown=new a({el:this.$error})),this.$error[this.model.messages.has("errors")?"addClass":"removeClass"]("severe")):(this.$error&&(this.$error.remove(),this.$error=null),this.children.errorPopdown&&(this.children.errorPopdown.remove(),this.children.errorPopdown=null)),this},remove:function(){return u(this.children).invoke("remove"),u(this.model).invoke("off"),this.manager&&this.manager.off(null,null,this),o.prototype.remove.call(this)},errorStatusTemplate:u.template('<% _(errors).each(function(error){ %><li class="error"><i class="icon-warning-sign"></i> <%- error %></li><% }); %><% _(warnings).each(function(warn){ %><li class="warning"><i class="icon-warning-sign"></i> <%- warn %></li><% }); %>')});return p});
