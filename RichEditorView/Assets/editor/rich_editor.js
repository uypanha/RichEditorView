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
"use strict";

var RE = {};

RE.mentionUsers = [];
RE.lookupKey = "key";
RE.menuItemKeyToDisplay = "value";
RE.selectTemplateKey = "template";

window.onload = function() {
    RE.callback("ready");
    RE.initEvents();
};

RE.editor = document.getElementById('editor');

// Not universally supported, but seems to work in iOS 7 and 8
document.addEventListener("selectionchange", function() {
                          RE.backuprange();
                          });

//looks specifically for a Range selection and not a Caret selection
RE.rangeSelectionExists = function() {
    //!! coerces a null to bool
    var sel = document.getSelection();
    if (sel && sel.type == "Range") {
        return true;
    }
    return false;
};

RE.rangeOrCaretSelectionExists = function() {
    //!! coerces a null to bool
    var sel = document.getSelection();
    if (sel && (sel.type == "Range" || sel.type == "Caret")) {
        return true;
    }
    return false;
};

RE.editor.addEventListener("input", function() {
                           RE.updatePlaceholder()
                           RE.backuprange();
                           RE.callback("input");
                           });

RE.editor.addEventListener("focus", function() {
                           RE.backuprange();
                           RE.callback("focus");
                           });

RE.editor.addEventListener("blur", function() {
                           RE.callback("blur");
                           });

RE.customAction = function(action) {
    RE.callback("action/" + action);
};

RE.updateHeight = function() {
    RE.callback("updateHeight");
}

RE.callbackQueue = [];
RE.runCallbackQueue = function() {
    if (RE.callbackQueue.length === 0) {
        return;
    }
    
    setTimeout(function() {
               window.location.href = "re-callback://";
               }, 0);
};

RE.getCommandQueue = function() {
    var commands = JSON.stringify(RE.callbackQueue);
    RE.callbackQueue = [];
    return commands;
};

RE.callback = function(method) {
    RE.callbackQueue.push(method);
    RE.runCallbackQueue();
};

RE.setHtml = function(contents) {
    var tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = contents;
    var images = tempWrapper.querySelectorAll("img");
    
    for (var i = 0; i < images.length; i++) {
        images[i].onload = RE.updateHeight;
    }
    
    RE.editor.innerHTML = tempWrapper.innerHTML;
    RE.updatePlaceholder();
};

RE.getHtml = function() {
    return RE.editor.innerHTML;
};

RE.getText = function() {
    return RE.editor.innerText;
};

RE.setBaseTextColor = function(color) {
    RE.editor.style.color  = color;
};

RE.setPlaceholderText = function(text) {
    RE.editor.setAttribute("placeholder", text);
};

RE.updatePlaceholder = function() {
    if (RE.containsEditorTags() || (RE.editor.textContent.length > 0 && RE.editor.innerHTML.length > 0)) {
        RE.editor.classList.remove("placeholder");
    } else {
        RE.editor.classList.add("placeholder");
    }
};

RE.containsEditorTags = function() {
    let content = RE.editor.innerHTML;
    return (content.indexOf('blockquote') !== -1 || content.indexOf('li') !== -1 || content.indexOf('img') !== -1);
}

RE.removeFormat = function() {
    document.execCommand('removeFormat', false, null);
    RE.enabledEditingItems();
};

RE.setFontSize = function(size) {
    RE.editor.style.fontSize = size;
};

RE.setBackgroundColor = function(color) {
    RE.editor.style.backgroundColor = color;
    RE.enabledEditingItems();
};

RE.setHeight = function(size) {
    RE.editor.style.height = size;
};

RE.undo = function() {
    document.execCommand('undo', false, null);
    RE.enabledEditingItems();
};

RE.redo = function() {
    document.execCommand('redo', false, null);
    RE.enabledEditingItems();
};

RE.setBold = function() {
    document.execCommand('bold', false, null);
    RE.enabledEditingItems();
};

RE.setItalic = function() {
    document.execCommand('italic', false, null);
    RE.enabledEditingItems();
};

RE.setSubscript = function() {
    document.execCommand('subscript', false, null);
    RE.enabledEditingItems();
};

RE.setSuperscript = function() {
    document.execCommand('superscript', false, null);
    RE.enabledEditingItems();
};

RE.setStrikeThrough = function() {
    document.execCommand('strikeThrough', false, null);
    RE.enabledEditingItems();
};

RE.setUnderline = function() {
    document.execCommand('underline', false, null);
    RE.enabledEditingItems();
};

RE.setTextColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('foreColor', false, color);
    document.execCommand("styleWithCSS", null, false);
    RE.enabledEditingItems();
};

RE.setTextBackgroundColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('hiliteColor', false, color);
    document.execCommand("styleWithCSS", null, false);
    RE.enabledEditingItems();
};

RE.setHeading = function(heading) {
    document.execCommand('formatBlock', false, '<h' + heading + '>');
    RE.enabledEditingItems();
};

RE.setIndent = function() {
    document.execCommand('indent', false, null);
    RE.enabledEditingItems();
};

RE.setOutdent = function() {
    document.execCommand('outdent', false, null);
    RE.enabledEditingItems();
};

RE.setOrderedList = function() {
    document.execCommand('insertOrderedList', false, null);
    RE.enabledEditingItems();
};

RE.setUnorderedList = function() {
    document.execCommand('insertUnorderedList', false, null);
    RE.enabledEditingItems();
};

RE.setJustifyLeft = function() {
    document.execCommand('justifyLeft', false, null);
    RE.enabledEditingItems();
};

RE.setJustifyCenter = function() {
    document.execCommand('justifyCenter', false, null);
    RE.enabledEditingItems();
};

RE.setJustifyRight = function() {
    document.execCommand('justifyRight', false, null);
    RE.enabledEditingItems();
};

RE.getLineHeight = function() {
    return RE.editor.style.lineHeight;
};

RE.setLineHeight = function(height) {
    RE.editor.style.lineHeight = height;
    RE.enabledEditingItems();
};

RE.insertImage = function(url, alt) {
    var img = document.createElement('img');
    img.setAttribute("src", url);
    img.setAttribute("alt", alt);
    img.onload = RE.updateHeight;
    
    RE.insertHTML(img.outerHTML);
    RE.calliback("input");
    RE.enabledEditingItems();
};

RE.setBlockquote = function() {
    document.execCommand('formatBlock', false, '<blockquote>');
    RE.enabledEditingItems();
};

RE.insertHTML = function(html) {
    RE.restorerange();
    document.execCommand('insertHTML', false, html);
    RE.enabledEditingItems();
};

RE.insertLink = function(url, title) {
    RE.restorerange();
    var sel = document.getSelection();
    if (sel.toString().length !== 0) {
        if (sel.rangeCount) {
            
            var el = document.createElement("a");
            el.setAttribute("href", url);
            el.setAttribute("title", title);
            
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    RE.callback("input");
    RE.enabledEditingItems();
};

RE.prepareInsert = function() {
    RE.backuprange();
};

RE.backuprange = function() {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        RE.currentSelection = {
            "startContainer": range.startContainer,
            "startOffset": range.startOffset,
            "endContainer": range.endContainer,
            "endOffset": range.endOffset
        };
    }
};

RE.addRangeToSelection = function(selection, range) {
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

// Programatically select a DOM element
RE.selectElementContents = function(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    // this.createSelectionFromRange sel, range
    RE.addRangeToSelection(sel, range);
};

RE.restorerange = function() {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(RE.currentSelection.startContainer, RE.currentSelection.startOffset);
    range.setEnd(RE.currentSelection.endContainer, RE.currentSelection.endOffset);
    selection.addRange(range);
};

RE.focus = function() {
    var range = document.createRange();
    range.selectNodeContents(RE.editor);
    range.collapse(false);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
};

RE.focusAtPoint = function(x, y) {
    var range = document.caretRangeFromPoint(x, y) || document.createRange();
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
};

RE.blurFocus = function() {
    RE.editor.blur();
};

/**
 Recursively search element ancestors to find a element nodeName e.g. A
 **/
var _findNodeByNameInContainer = function(element, nodeName, rootElementId) {
    if (element.nodeName == nodeName) {
        return element;
    } else {
        if (element.id === rootElementId) {
            return null;
        }
        _findNodeByNameInContainer(element.parentElement, nodeName, rootElementId);
    }
};

var isAnchorNode = function(node) {
    return ("A" == node.nodeName);
};

RE.getAnchorTagsInNode = function(node) {
    var links = [];
    
    while (node.nextSibling !== null && node.nextSibling !== undefined) {
        node = node.nextSibling;
        if (isAnchorNode(node)) {
            links.push(node.getAttribute('href'));
        }
    }
    return links;
};

RE.countAnchorTagsInNode = function(node) {
    return RE.getAnchorTagsInNode(node).length;
};

/**
 * If the current selection's parent is an anchor tag, get the href.
 * @returns {string}
 */
RE.getSelectedHref = function() {
    var href, sel;
    href = '';
    sel = window.getSelection();
    if (!RE.rangeOrCaretSelectionExists()) {
        return null;
    }
    
    var tags = RE.getAnchorTagsInNode(sel.anchorNode);
    //if more than one link is there, return null
    if (tags.length > 1) {
        return null;
    } else if (tags.length == 1) {
        href = tags[0];
    } else {
        var node = _findNodeByNameInContainer(sel.anchorNode.parentElement, 'A', 'editor');
        href = node.href;
    }
    
    return href ? href : null;
};

// Returns the cursor position relative to its current position onscreen.
// Can be negative if it is above what is visible
RE.getRelativeCaretYPosition = function() {
    var y = 0;
    var sel = window.getSelection();
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        var needsWorkAround = (range.startOffset == 0)
        /* Removing fixes bug when node name other than 'div' */
        // && range.startContainer.nodeName.toLowerCase() == 'div');
        if (needsWorkAround) {
            y = range.startContainer.offsetTop - window.pageYOffset;
        } else {
            if (range.getClientRects) {
                var rects=range.getClientRects();
                if (rects.length > 0) {
                    y = rects[0].top;
                }
            }
        }
    }
    
    return y;
};

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

RE.prepareAtWho = function() {
    
    var tribute = new Tribute({
        values: function (text, cb) {
            RE.remoteSearch(text, users => cb(users));
        },
        selectTemplate: function (item) {
            if (typeof item === 'undefined') return null;
            if (this.range.isContentEditable(this.current.element) && !(item.original[RE.selectTemplateKey] === 'undefined')) {
                return '<span contenteditable="false">' + item.original[RE.selectTemplateKey] + '</span>';
            }

            return '<span contenteditable="false">@' + item.original[RE.menuItemKeyToDisplay] + '</span>';
        },
        menuItemTemplate: function (item) {
            return item.original[RE.menuItemKeyToDisplay];
        },
        lookup: RE.lookupKey || 'key'
    });
    
    tribute.attach(RE.editor);
}

RE.remoteSearch = function(text, cb) {
    if (RE.mentionUsers == undefined || RE.mentionUsers.length == 0) {
        cb([]);
    } else {
        cb(RE.mentionUsers);
    }
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
RE.enabledEditingItems = function(e) {

    console.log('enabledEditingItems');
    var items = [];

    if (RE.editor.isCommandEnabled('bold')) {
        items.push('bold');
    }
    if (RE.editor.isCommandEnabled('bold')) {
        items.push('bold');
    }
    if (RE.editor.isCommandEnabled('italic')) {
        items.push('italic');
    }
    if (RE.editor.isCommandEnabled('subscript')) {
        items.push('subscript');
    }
    if (RE.editor.isCommandEnabled('superscript')) {
        items.push('superscript');
    }
    if (RE.editor.isCommandEnabled('strikeThrough')) {
        items.push('strikeThrough');
    }
    if (RE.editor.isCommandEnabled('underline')) {
        items.push('underline');
    }
    if (RE.editor.isCommandEnabled('insertOrderedList')) {
        items.push('orderedList');
    }
    if (RE.editor.isCommandEnabled('insertUnorderedList')) {
        items.push('unorderedList');
    }
    if (RE.editor.isCommandEnabled('justifyCenter')) {
        items.push('justifyCenter');
    }
    if (RE.editor.isCommandEnabled('justifyFull')) {
        items.push('justifyFull');
    }
    if (RE.editor.isCommandEnabled('justifyLeft')) {
        items.push('justifyLeft');
    }
    if (RE.editor.isCommandEnabled('justifyRight')) {
        items.push('justifyRight');
    }
    if (RE.editor.isCommandEnabled('insertHorizontalRule')) {
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
        var s = RE.editor.getSelectedNode();
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
            RE.editor.currentEditingLink = t;
            var title = t.attr('title');
            items.push('link:'+t.attr('href'));
            if (t.attr('title') !== undefined) {
                items.push('link-title:'+t.attr('title'));
            }
            
        } else {
            RE.editor.currentEditingLink = null;
        }
        // Blockquote
        if (nodeName == 'blockquote') {
            items.push('indent');
        }
        // Image
        if (nodeName == 'img') {
            RE.editor.currentEditingImage = t;
            items.push('image:'+t.attr('src'));
            if (t.attr('alt') !== undefined) {
                items.push('image-alt:'+t.attr('alt'));
            }
            
        } else {
            RE.editor.currentEditingImage = null;
        }
    }

    if (items.length > 0) {
        console.log("selectedItems/");
        RE.callback("selectedItems/" + items.join(','));
    }
}