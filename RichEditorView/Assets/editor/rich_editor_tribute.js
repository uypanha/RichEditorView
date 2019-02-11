/**
 * Copyright (C) 2015 Wasabeef
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

RE.mentionUsers = [];
RE.lookupKey = "key";
RE.menuItemKeyToDisplay = "value";
RE.selectTemplateKey = "template";
RE.limitTributeDisplay = 0;

RE.setMentionUsers = function(users) {
    console.log(users);
    if (Array.isArray(users)) {
        RE.mentionUsers = users;
    }
}

RE.setLookUpKey = function(key) {
    if (typeof key === 'string' || key instanceof String) {
        RE.lookupKey = key;
    }
}

RE.setMenuItemToDisplayKey = function(key) {
    if (typeof key === 'string' || key instanceof String) {
        RE.menuItemKeyToDisplay = key;
    }
}

RE.setSelectTemplateKey = function(key) {
    if (typeof key === 'string' || key instanceof String) {
        RE.selectTemplateKey = key
    }
}

RE.setLimitDisplayToMention = function(limit) {
    if (Number.isInteger(limit)) {
        RE.limitTributeDisplay = limit;
    }
}

RE.prepareAtWho = function() {
    
    if (!(RE.tribute === undefined) && RE.tribute instanceof Tribute) {
        RE.tribute.detach(RE.editor);
    }
    
    RE.tribute = new Tribute({
        values: function (text, cb) {
            RE.remoteSearch(text, users => cb(users));
        },
        selectTemplate: function (item) {
            if (typeof item === 'undefined') return null;
            if (this.range.isContentEditable(this.current.element) && !(item.original[RE.selectTemplateKey] === 'undefined')) {
                return item.original[RE.selectTemplateKey];
            }

            return '@' + item.original[RE.menuItemKeyToDisplay];
        },
        menuItemTemplate: function (item) {
            return item.original[RE.menuItemKeyToDisplay];
        },
        lookup: RE.lookupKey || 'key'
    });
    
    RE.tribute.attach(RE.editor);
}

RE.remoteSearch = function(text, cb) {
    var users = [];
    if (!(RE.mentionUsers == undefined || RE.mentionUsers.length == 0)) {
        users = RE.mentionUsers;
    }
    users = users.filter(user => user[RE.lookupKey].replace(/\s+/g, '').toLowerCase().includes(text.toLowerCase()));
    
    if (RE.limitTributeDisplay > 0) {
        users = users.slice(0, RE.limitTributeDisplay);
    }
    
    cb(users);
}

// Editing Delegation and Callbacks
RE.initEvents = function() {

    $("#editor").on('touchend', function(e) {
        RE.enabledEditingItems(e);
    });

    $(document).on('selectionchange',function(e){
        // zss_editor.setScrollPosition();
        RE.enabledEditingItems(e);
    });

    $(window).on('touchmove', function(e) {
        // zss_editor.setScrollPosition();
        RE.enabledEditingItems(e);
    });

}

// Checking Editing selection
RE.isCommandEnabled = function(commandName) {
    return document.queryCommandState(commandName);
}

RE.enabledEditingItems = function(e) {

    console.log('enabledEditingItems');
    var items = [];

    if (RE.isCommandEnabled('bold')) {
        items.push('bold');
    }
    if (RE.isCommandEnabled('bold')) {
        items.push('bold');
    }
    if (RE.isCommandEnabled('italic')) {
        items.push('italic');
    }
    if (RE.isCommandEnabled('subscript')) {
        items.push('subscript');
    }
    if (RE.isCommandEnabled('superscript')) {
        items.push('superscript');
    }
    if (RE.isCommandEnabled('strikeThrough')) {
        items.push('strikeThrough');
    }
    if (RE.isCommandEnabled('underline')) {
        items.push('underline');
    }
    if (RE.isCommandEnabled('insertOrderedList')) {
        items.push('orderedList');
    }
    if (RE.isCommandEnabled('insertUnorderedList')) {
        items.push('unorderedList');
    }
    if (RE.isCommandEnabled('justifyCenter')) {
        items.push('justifyCenter');
    }
    if (RE.isCommandEnabled('justifyFull')) {
        items.push('justifyFull');
    }
    if (RE.isCommandEnabled('justifyLeft')) {
        items.push('justifyLeft');
    }
    if (RE.isCommandEnabled('justifyRight')) {
        items.push('justifyRight');
    }
    if (RE.isCommandEnabled('insertHorizontalRule')) {
        items.push('horizontalRule');
    }
    var formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock.length > 0) {
        items.push(formatBlock);
    }
    // Image


    // Use jQuery to figure out those that are not supported
    if (typeof(e) != "undefined") {
        // The target element
        var s = RE.getSelectedNode();
        var t = $(s);
        var nodeName = e.target.nodeName.toLowerCase();
        
        // Background Color
        var bgColor = t.css('backgroundColor');
        if (bgColor.length != 0 && bgColor != 'rgba(0, 0, 0, 0)' && bgColor != 'rgb(0, 0, 0)' && bgColor != 'transparent') {
            items.push('backgroundColor');
        }
        // Text Color
        var textColor = t.css('color');
        if (textColor.length != 0 && textColor != 'rgba(0, 0, 0, 0)' && textColor != 'rgb(0, 0, 0)' && textColor != 'transparent') {
            items.push('textColor');
        }
		
        // Link
        if (nodeName == 'a') {
//            RE.editor.currentEditingLink = t;
            var title = t.attr('title');
            items.push('link:'+t.attr('href'));
            if (t.attr('title') !== undefined) {
                items.push('link-title:'+t.attr('title'));
            }
            
        } else {
//            RE.editor.currentEditingLink = null;
        }
        // Blockquote
        if (nodeName == 'blockquote') {
            items.push('indent');
        }
        // Image
        if (nodeName == 'img') {
//            RE.editor.currentEditingImage = t;
            items.push('image:'+t.attr('src'));
            if (t.attr('alt') !== undefined) {
                items.push('image-alt:'+t.attr('alt'));
            }
        } else {
//            RE.editor.currentEditingImage = null;
        }
    }

    if (items.length > 0) {
        console.log("selectedItems/");
        RE.callback("selectedItems/" + items.join(','));
    }
}

RE.getSelectedNode = function() {
    var node,selection;
    if (window.getSelection) {
        selection = getSelection();
        node = selection.anchorNode;
    }
    if (!node && document.selection) {
        selection = document.selection
        var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
        node = range.commonAncestorContainer ? range.commonAncestorContainer :
        range.parentElement ? range.parentElement() : range.item(0);
    }
    if (node) {
        return (node.nodeName == "#text" ? node.parentNode : node);
    }
};
