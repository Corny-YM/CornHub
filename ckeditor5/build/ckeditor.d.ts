/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Underline,
} from "@ckeditor/ckeditor5-basic-styles";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { CloudServices } from "@ckeditor/ckeditor5-cloud-services";
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import type { EditorConfig } from "@ckeditor/ckeditor5-core";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { FindAndReplace } from "@ckeditor/ckeditor5-find-and-replace";
import { FontFamily, FontSize } from "@ckeditor/ckeditor5-font";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { GeneralHtmlSupport } from "@ckeditor/ckeditor5-html-support";
import { Indent } from "@ckeditor/ckeditor5-indent";
import { AutoLink, Link } from "@ckeditor/ckeditor5-link";
import { List, TodoList } from "@ckeditor/ckeditor5-list";
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office";
import { RemoveFormat } from "@ckeditor/ckeditor5-remove-format";
import { StandardEditingMode } from "@ckeditor/ckeditor5-restricted-editing";
import { ShowBlocks } from "@ckeditor/ckeditor5-show-blocks";
import { TextTransformation } from "@ckeditor/ckeditor5-typing";
import { Undo } from "@ckeditor/ckeditor5-undo";
declare class Editor extends ClassicEditor {
  static builtinPlugins: (
    | typeof Alignment
    | typeof AutoLink
    | typeof Autoformat
    | typeof BlockQuote
    | typeof Bold
    | typeof CloudServices
    | typeof Code
    | typeof CodeBlock
    | typeof Essentials
    | typeof FindAndReplace
    | typeof FontFamily
    | typeof FontSize
    | typeof GeneralHtmlSupport
    | typeof Heading
    | typeof Indent
    | typeof Italic
    | typeof Link
    | typeof List
    | typeof MediaEmbed
    | typeof Paragraph
    | typeof PasteFromOffice
    | typeof RemoveFormat
    | typeof ShowBlocks
    | typeof StandardEditingMode
    | typeof Strikethrough
    | typeof TextTransformation
    | typeof TodoList
    | typeof Underline
    | typeof Undo
  )[];
  static defaultConfig: EditorConfig;
}
export default Editor;
