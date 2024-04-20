var Ben = Ben || {};
Ben.JS = Ben.JS || {};
Ben.JS.RecordPreviewPane = Ben.JS.RecordPreviewPane || {
    ctx:
    {
        // Meta informations about the current script.
        script: {        
            version: '1.0.0.0',
            author: "ben@outlook.de",
            namespace: "Ben.JS.RecordPreviewPane",
            indentCount: 0,
            verbose: true
        },
        // Settings of the current script.
        _defaultPaneWidth: 600,
        _listWidth: null,
        _urlCheckInterval: null,
        _oldUrl: null
    },
    onLoad: async function() {
        // Pubilc-Function that gets called onload of the script. As there is no regular onload trigger, the function gets called at the end of the script.
        // It initializes the UrlCheck.
        let 
            fncName = "onLoad",
            _ = Ben.JS.RecordPreviewPane;        

        try {
            _._trace.enterScope(fncName);
            _._trace.log("Initialize URL Check.");
            _.ctx._oldUrl = parent.window.location.href;
            _._clearUrlCheckInterval();
            _.ctx._urlCheckInterval = _._createUrlCheckInterval();
            _._trace.log("URL Check initialized.");
        }
        catch(err) {  
            _._trace.error(fncName, err);
        }
        finally {
            _._trace.exitScope(fncName);
        }
    },
    onRecordSelect: async function (context, configPaneWidth) {
        // Public-Function that gets called when a record is selected.
        // It opens the Preview Pane.
        let 
            fncName = "onRecordSelect",
            _ = Ben.JS.RecordPreviewPane;

        try {
            _._trace.enterScope(fncName);
            _._trace.log("Getting Form context.");
            await _._openPreviewPane(context.getFormContext(), configPaneWidth.replace("px",""));
        }
        catch(err) {
            _._trace.error(fncName, err);
        }
        finally {
            _._trace.exitScope(fncName);
        }
    },
    onUrlChange: function() {
        // Public-Function that gets called when the url changes. As there is no regular onload trigger, the function registered during the onLoad call.
        // It removes the UrlCheckIntervall and closes the preview pane.
        let 
            fncName = "onUrlChange",
            _ = Ben.JS.RecordPreviewPane;

        try {
            _._trace.enterScope(fncName);
            _._clearUrlCheckInterval(_.ctx._urlCheckInterval);
            _._closePreviewPane();
        }
        catch(err) {
            _._trace.error(fncName, err);
        }
        finally {
            _._trace.exitScope(fncName);
        }
    },
    _openPreviewPane: async function (formContext, configPaneWidth) {
        // Private-Function - It opens the Preview Pane and creates a new one if there is no existing pane.
        let 
            fncName = "_openPreviewPane",
            _ = Ben.JS.RecordPreviewPane;

        try {
            _._trace.enterScope(fncName);
       
            if (!parent.Xrm.App.sidePanes.getPane("RecordPreviewPane")) {
                _._trace.log("Creating a new pane.");

                _._trace.log("Getting Pane Width.");
                let paneWidth = _.ctx._defaultPaneWidth;
                if(configPaneWidth.endsWith('%')) { 
                    let p = configPaneWidth.replaceAll(' ', '').replace('%', '');
                    p = parseFloat(p) / 100;
                    _.ctx._listWidth =  _._getListViewWidth();
                    paneWidth = _.ctx._listWidth * p;
                }
                else if (parseInt(configPaneWidth)) {
                    paneWidth = parseInt(configPaneWidth);
                }
                _._trace.log("Pane Width is: ", paneWidth);

                let selectedRecordPane = {
                    imageSrc: parent.Xrm.Utility.getGlobalContext().getClientUrl() + "/WebResources/mspp_web_pages.svg",
                    paneId: "RecordPreviewPane",
                    width: paneWidth,
                    alwaysRender: false,
                    hideHeader: true,
                    canClose: true,
                    badge: true
                }
                RecordPreviewPane = await parent.Xrm.App.sidePanes.createPane(selectedRecordPane);
            }     

            var _selectedRecord = formContext.data.entity;
            
            _._trace.log("Set the seleced Record as target for the Pane.");
            let selectedRecordPageInput = {
                pageType: "entityrecord",
                entityName: _selectedRecord.getEntityName(),
                entityId: _selectedRecord.getId().replace("{", "").replace("}", "")
            };
    
            _._trace.log("Navigate the pane to the new Target.");
            await RecordPreviewPane.navigate(selectedRecordPageInput);

            _._trace.log("Expanding the pane.")
            parent.Xrm.App.sidePanes.state = 1; 
        }
        catch(err) {
            _._trace.error(fncName, err);
        }
        finally {
            _._trace.exitScope(fncName);
        }
    },
    _closePreviewPane: async function(){
        // Private-Function - It closes the Preview Pane.
        let 
            fncName = "_closePreviewPane",
            _ = Ben.JS.RecordPreviewPane

        try {
            _._trace.enterScope(fncName);
            if (parent.Xrm.App.sidePanes.getPane("RecordPreviewPane")) {
                if(parent.Xrm.App.sidePanes.getPane("RecordPreviewPane") == Xrm.App.sidePanes.getSelectedPane()) {
                    _._trace.log("Pane is selected, collapse it now.")
                    parent.Xrm.App.sidePanes.state = 0;
                }
                _._trace.log("Closing pane now.")
                await parent.Xrm.App.sidePanes.getPane("RecordPreviewPane").close();
            }
            else {
                _._trace.log("No pane existsting.")
            }
        }
        catch(err) {
            _._trace.error(fncName, err);
        }
        finally {
            _._trace.exitScope(fncName);
        }
    },
    _getListViewWidth: function() {
        // Private-Function - It gets the width of the current list.
        // It access the dom and is in fact unsupported, but this is only called if you use a percentage value for the pane wide.
        let 
            fncName = "_getListViewWidth",
            _ = Ben.JS.RecordPreviewPane,
            result = null;

        try {
            _._trace.enterScope(fncName);

            _._trace.log("Looking for DIV with ID 'mainContent'.");

            if(parent.document.querySelector('[id^="mainContent"]')) {
                result = parent.document.querySelector('[data-id^="GridRoot"]').offsetWidth;
                _._trace.log("Found DIV in parent element.");
            } 
            else{
                _._trace.log("Could not find DIV in parent element.");
            }
    
            _._trace.log("Set _.ctx._listWidth to value: ", result);
            _.ctx._listWidth = result;
            return result;
        }
        catch(err) {
            _._trace.error(fncName, err);
        }
        finally {
            _._trace.exitScope(fncName);
        }
    },
    _createUrlCheckInterval() {
        // Private-Function - It creates an interval the check for url changes periodcally.
        let 
            fncName = "_createUrlCheckInterval",
            _ =  Ben.JS.RecordPreviewPane;

        try {
            _._trace.enterScope(fncName);
            _._trace.log("Creating Interval with 1000ms.");
            return setInterval(_._urlCheck, 1000);
        }
        catch(err) {
            _._trace.error(fncName, err);
        }
        finally {
            _._trace.exitScope(fncName);
        }
    },
    _urlCheck: function() {
        // Private-Function - It compares in each interval the url with the previous interval.
        let 
            fncName = "_urlCheck",
            _ =  Ben.JS.RecordPreviewPane;

        try {
            //_._trace.enterScope(fncName);

            if(parent.window.location.href != _.ctx._oldUrl){
                _._trace.log("URL has changed, trigger now 'onUrlChange' function.");
                _.onUrlChange();
                _._trace.log("Updating _.ctx._oldUrl to the new URL.");
                _.ctx._oldUrl = parent.window.location.href;
            }
        }
        catch(err) {
            _._trace.error(fncName, err);
        }
        finally {
            //_._trace.exitScope(fncName);
        }
    },
    _clearUrlCheckInterval: function() {
        // Private-Function - It removes the interval that checks for url changes.
        let 
            fncName = "_clearUrlCheckInterval",
            _ = Ben.JS.RecordPreviewPane;

        try {
            _._trace.enterScope(fncName);

            if (!_.ctx._urlCheckInterval) {
                _._trace.log("_.ctx._urlCheckInterval is not defined.");
                return;
            }
    
            _._trace.log("Clearing interval _.ctx._urlCheckInterval.");
            clearInterval(_.ctx._urlCheckInterval);
        }
        catch(err) {
            _._trace.error(fncName, err);
        }
        finally {
            _._trace.exitScope(fncName);
        }
    },
    _trace: {
        log: function (msg) {
            let 
            _ = Ben.JS.RecordPreviewPane;

            if (_.ctx.script.verbose) {
                console.log("BEN | "  + _._trace.indent() +  " ▷ " + msg);
            }
        },
        enterScope: function (fncName) {
            let 
            _ = Ben.JS.RecordPreviewPane;

            if (_.ctx.script.verbose) {
                console.log("BEN | "  + _._trace.indent() +  " ▼ Enter " + _.ctx.script.namespace + "." + fncName);
                _.ctx.script.indentCount++;
            }
        },
        exitScope: function (fncName) {
            let 
            _ = Ben.JS.RecordPreviewPane;

            if (_.ctx.script.verbose) {
                _.ctx.script.indentCount--;
                console.log("BEN | "  + _._trace.indent() + " ▲ Exit  " + _.ctx.script.namespace + "." + fncName);
            }
        },
        error: function (fncName, err) {
            let 
            _ = Ben.JS.RecordPreviewPane;

            console.log("BEN | " + "⚠️ Error in " + _.ctx.script.namespace + "." + fncName + ": " + err);
        },
        indent: function() {
            let 
            _ = Ben.JS.RecordPreviewPane,
            result = "";

            for (var i = 0; i < _.ctx.script.indentCount; i++)
            result += "   ";
    
            return result;
        }
    }
};

// Run the onLoad function()
Ben.JS.RecordPreviewPane.onLoad();
