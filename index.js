// Creator: Néstor Campos (https://github.com/nescampos) and Techgethr (https://github.com/Techgethr)
// Version: 1.0

/*
    Function name: initialize
    Description: Initializes this WebMonetization library
    Parameters: (document: document variable (DOM) for handling)
    Returns: none
*/
exports.initialize = function(document) {
    this.document = document;
    this.total = 0;
    this.scale = 0;
    this.assetCode = null;
    this.classExclusiveContent = null;
    this.classHiddenContent = null;
    this.pointer = null;
}

/*
    Function name: isBrowserEnabled
    Description: Returns a boolean value specifying if WebMonetization is enabled or not in the browser.
    Parameters: none
    Returns: boolean
*/
exports.isBrowserEnabled = function() {
    if (this.document.monetization === undefined) {
        return false;
    }
    else {
        return true;
    }
}

/*
    Function name: getMonetizationState
    Description: Returns a string value specifying state if WebMonetization is enabled or "Not enabled in this browser" if not enabled.
    Parameters: none
    Returns: string
*/
exports.getMonetizationState = function() {
    if (this.isBrowserEnabled()) {
        return this.document.monetization.state;
    }
    else {
        return "Not enabled in this browser";
    }
}

/*
    Function name: getDocument
    Description: Returns the document (DOM) with Monetization configurations.
    Parameters: none
    Returns: DOM (document)
*/
exports.getDocument = function() {
    return this.document;
}

/*
    Function name: registerMonetizedContent
    Description: Register classes for exclusive and hidden content when WebMonetization is in use.
    Parameters: (classExclusiveContent: string, class name with exclusive content), (classHiddenContent: string, class name with hidden content when WebMonetization is enabled and disabled)
    Returns: none
*/
exports.registerMonetizedContent = function(classExclusiveContent, classHiddenContent) {
    this.classExclusiveContent = classExclusiveContent;
    this.classHiddenContent = classHiddenContent;
}

/*
    Function name: start
    Description: Creates meta tag for WebMonetization and call a function if specified.
    Parameters: (pointer: string, pointer address of creator), (callbackFunction [optional]: funcion for calling after starting WebMonetization)
    Returns: none
*/
exports.start = function(pointer,callbackFunction) {
    if(pointer === null || pointer === undefined) {
        throw new ReferenceError("pointer is required");
    }
    const monetizationTag = this.document.querySelector('meta[name="monetization"]');
    if (!monetizationTag) {
        var meta = this.document.createElement('meta');
        meta.name = "monetization";
        this.pointer = pointer;
        meta.content = pointer;
        this.document.getElementsByTagName('head')[0].appendChild(meta);
        if(this.isBrowserEnabled()){
            if(this.classExclusiveContent){
                this.document.monetization.addEventListener('monetizationstart', () => {
                    this.document.getElementsByClassName(this.classExclusiveContent).classList.remove(this.classHiddenContent)
                  });
                this.document.monetization.addEventListener('monetizationstop', () => {
                    this.document.getElementsByClassName(this.classExclusiveContent).classList.add(this.classHiddenContent)
                  });
            }
            
            this.document.monetization.addEventListener('monetizationprogress',  ev => {
                if (this.total === 0) {
                    this.scale = ev.detail.assetScale;
                    this.assetCode = ev.detail.assetCode;
                }
                this.total += Number(ev.detail.amount);
              });
        }
        
    }
    if(callbackFunction){
        callbackFunction();
    }
}

/*
    Function name: isPendingState
    Description: Returns a boolean value specifying if WebMonetization is in "pending" state.
    Parameters: none
    Returns: boolean
*/
exports.isPendingState = function() {
    return this.isBrowserEnabled() && this.document.monetization.state === 'pending';
}

/*
    Function name: isStartedState
    Description: Returns a boolean value specifying if WebMonetization is in "started" state.
    Parameters: none
    Returns: boolean
*/
exports.isStartedState = function() {
    return this.isBrowserEnabled() && this.document.monetization.state === 'started';
}

/*
    Function name: isStoppedState
    Description: Returns a boolean value specifying if WebMonetization is in "stopped" state.
    Parameters: none
    Returns: boolean
*/
exports.isStoppedState = function() {
    return this.isBrowserEnabled() && this.document.monetization.state === 'stopped';
}

/*
    Function name: isStoppedState
    Description: Returns a boolean value specifying if WebMonetization is undefined (not enabled in browser).
    Parameters: none
    Returns: boolean
*/
exports.isUndefinedState = function() {
    return this.document.monetization === undefined;
}

/*
    Function name: changePointer
    Description: Change meta tag for WebMonetization with new pointer and call a function if specified.
    Parameters: (pointer: string, pointer address of creator), (createIfNotExist: boolea, creates meta tag if not exists),(callbackFunction [optional]: funcion for calling after starting WebMonetization)
    Returns: none
*/
exports.changePointer = function(pointer, createIfNotExist = false,callbackFunction) {
    if(pointer === null || pointer === undefined) {
        throw new ReferenceError("pointer is required");
    }

    const monetizationTag = this.document.querySelector('meta[name="monetization"]');
    if (monetizationTag) {
        this.pointer = pointer;
        monetizationTag.content = pointer;
        if(callbackFunction){
            callbackFunction();
        }
    }
    else {
        if(createIfNotExist) {
            this.start(pointer,callbackFunction);
        }
    }
}

/*
    Function name: registerStartListener
    Description: add listener to monetizationstart event.
    Parameters: (listenerFunction: function)
    Returns: none
*/
exports.registerStartListener = function(listenerFunction) {
    if (this.isBrowserEnabled()) {
        this.document.monetization.addEventListener('monetizationstart', () => {
            listenerFunction()
        });
    }
}

/*
    Function name: registerProgressListener
    Description: add listener to monetizationprogress event.
    Parameters: (listenerFunction: function)
    Returns: none
*/
exports.registerProgressListener = function(listenerFunction) {
    if (this.isBrowserEnabled()) {
        this.document.monetization.addEventListener('monetizationprogress',  ev => {
            listenerFunction();
          });
    }
}

/*
    Function name: getTotalAmountFromCurrentUser
    Description: return the total amount got from current user
    Parameters:
    Returns: Number
*/
exports.getTotalAmountFromCurrentUser = function(){
    return this.total;
}

/*
    Function name: getScaleFromCurrentUser
    Description: return the scale for payment from current user
    Parameters:
    Returns: Number
*/
exports.getScaleFromCurrentUser = function(){
    return this.scale;
}

/*
    Function name: getCurrentPointer
    Description: return the wallet pointer for payment
    Parameters:
    Returns: string
*/
exports.getCurrentPointer = function(){
    return this.pointer;
}

/*
    Function name: getAssetCodeFromCurrentUser
    Description: return the asset code for payment from current user
    Parameters:
    Returns: String
*/
exports.getAssetCodeFromCurrentUser = function(){
    return this.assetCode;
}

/*
    Function name: registerStopListener
    Description: add listener to monetizationstop event.
    Parameters: (listenerFunction: function)
    Returns: none
*/
exports.registerStopListener = function(listenerFunction) {
    if (this.isBrowserEnabled()) {
        this.document.monetization.addEventListener('monetizationstop', () => {
            listenerFunction()
        });
    }
}

/*
    Function name: registerPendingListener
    Description: add listener to monetizationpending event.
    Parameters: (listenerFunction: function)
    Returns: none
*/
exports.registerPendingListener = function(listenerFunction) {
    if (this.isBrowserEnabled()) {
        this.document.monetization.addEventListener('monetizationpending', () => {
            listenerFunction()
        });
    }
}

/*
    Function name: executeOnUndefined
    Description: execute a function if WebMonetization is undefined in web browser.
    Parameters: (callbackFunction: function)
    Returns: none
*/
exports.executeOnUndefined = function(callbackFunction) {
    if (this.isUndefinedState()) {
        callbackFunction();
    }
}

/*
    Function name: stop
    Description: Remove WebMonetization for web page.
    Parameters: (callbackFunction [optional]: funcion for calling after stop WebMonetization)
    Returns: none
*/
exports.stop = function(callbackFunction) {
    const monetizationTag = this.document.querySelector('meta[name="monetization"]')
    if (monetizationTag) {
        monetizationTag.remove();

        if(callbackFunction){
            callbackFunction();
        }
    }
}

/*
    Function name: enableMonetizationOniFrame
    Description: Enables WebMonetization in an iFrame.
    Parameters: (iframeId: string, iFrame id for identifiying)
    Returns: none
*/
exports.enableMonetizationOniFrame = function(iframeId){
    var iFrameToEnable = this.document.getElementById(iframeId);
    if(iFrameToEnable){
        iFrameToEnable.allow = "monetization";
    }
}

/*
    Function name: disableMonetizationOniFrame
    Description: Disables WebMonetization in an iFrame.
    Parameters: (iframeId: string, iFrame id for identifiying)
    Returns: none
*/
exports.disableMonetizationOniFrame = function(iframeId){
    var iFrameToEnable = this.document.getElementById(iframeId);
    if(iFrameToEnable){
        iFrameToEnable.removeAttribute("allow");
    }
}