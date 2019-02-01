//
//  Mention+Delegation.swift
//  RichEditorView
//
//  Created by Phanha Uy on 2/1/19.
//

import Foundation

public protocol MentionCodable: Codable {
    
    var valueToDisplay: String? { get set }
    
}

public protocol RichEditorMentionPeopleDataSource: RichEditorDataSource {
    
    func richEditorMentionPeople(_ editor: RichEditorView) -> [MentionCodable]
    
    func richEditorKeyToLookUp(_ editor: RichEditorView) -> String?
    
}
