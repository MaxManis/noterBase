export const toolbarSetup = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "fontFamily",
    "list",
    "textAlign",
    "colorPicker",
    "link",
    "embedded",
    "emoji",
    "image",
    "remove",
    "history",
  ],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "monospace",
      "superscript",
      "subscript",
    ],
    bold: { icon: "bold", className: undefined },
    italic: { icon: "italic", className: undefined },
    underline: { icon: "underline", className: undefined },
    strikethrough: { icon: "strikethrough", className: undefined },
    monospace: { icon: "monospace", className: undefined },
    superscript: { icon: "superscript", className: undefined },
    subscript: { icon: "subscript", className: undefined },
  },
  blockType: {
    inDropdown: true,
    options: [
      "Normal",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "Blockquote",
      "Code",
    ],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
};

export const toolbarS = {
  options: ["inline", "link", "list", "image"], // This is where you can specify what options you need in
  //the toolbar and appears in the same order as specified
  inline: {
    options: ["bold", "italic", "underline"], // this can be specified as well, toolbar wont have
    //strikethrough, 'monospace', 'superscript', 'subscript'
  },
  image: {
    alignmentEnabled: true,
    // uploadCallback: this!.UploadImageCallBack,
    alt: { present: true, mandatory: false },
    previewImage: true,
  },
};
