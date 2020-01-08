//
//  Mention+Delegation.swift
//  RichEditorView
//
//  Created by Phanha Uy on 2/1/19.
//

import Foundation

public protocol RichEditorMentionPeopleDataSource: RichEditorDataSource {
    
    func numberOfItems(_ editor: RichEditorView) -> Int
    
    func richEditor(_ editor: RichEditorView, jsonUserDataFor index: Int) -> [String: Any]
    
    func richEditorKeyToLookUp(_ editor: RichEditorView) -> String?
    
    func richEditor(_ editor: RichEditorView, htmlItemToDisplayFor index: Int) -> String?
    
    func richEditor(_ editor: RichEditorView, selectedHtmlTemplateFor index: Int) -> String?
    
    func richEditorDisplayLimit(_ editor: RichEditorView) -> Int
}

extension RichEditorMentionPeopleDataSource {
    
    func richEditorDisplayLimit(_ editor: RichEditorView) -> Int {
        return 0
    }
    
    func richEditor(_ editor: RichEditorView, htmlItemToDisplayFor index: Int) -> String? {
        return nil
    }
    
    func richEditor(_ editor: RichEditorView, selectedHtmlTemplateFor index: Int) -> String? {
        return nil
    }
}
