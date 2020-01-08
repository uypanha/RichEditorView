//
//  RichEditorWebView.swift
//  RichEditorView
//
//  Created by Phanha Uy on 1/8/20.
//

import WebKit

public class RichEditorWebView: WKWebView {

    public var accessoryView: UIView?
    
    public override var inputAccessoryView: UIView? {
        return accessoryView
    }
}
