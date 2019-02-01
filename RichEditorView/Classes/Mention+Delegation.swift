//
//  Mention+Delegation.swift
//  RichEditorView
//
//  Created by Phanha Uy on 2/1/19.
//

import Foundation

open class MentionCodable: Encodable {
    
    var valueToDisplay: String?
    
    public init(_ valueToDisplay: String? = nil) {
        self.valueToDisplay = valueToDisplay
    }
}

public protocol RichEditorMentionPeopleDataSource: RichEditorDataSource {
    
    func richEditorMentionPeople(_ editor: RichEditorView) -> [MentionCodable]
    
    func richEditorKeyToLookUp(_ editor: RichEditorView) -> String?
    
}
