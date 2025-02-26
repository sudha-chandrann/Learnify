"use client";
import * as React from "react";
import {
  AlignJustifyIcon,
  List,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Bold,
  Italic,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Highlighter,
  Upload,
  ListOrdered,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";


interface ToolBarProps {
  editor: Editor | null;
}

export default function ToolBar({ editor }: ToolBarProps) {
  const [coloropen, setcoloropen] = React.useState(false);
   
  
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };


  


  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Underline className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive("underline"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <AlignJustifyIcon className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      pressed: editor.isActive({ textAlign: "justify" }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("code"),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
    {
      icon: <Upload className="size-4" />,
      onClick: addImage,
      pressed: false,
    },

  ];

  const familyfont = [
    {
      label: "Inter",
      onClick: () => editor.chain().focus().setFontFamily("Inter").run(),
      pressed: editor.isActive("textStyle", { fontFamily: "Inter" }),
      id: "inter",
    },
    {
      label: "Comic Sans",
      onClick: () =>
        editor
          .chain()
          .focus()
          .setFontFamily('"Comic Sans MS", "Comic Sans"')
          .run(),
      pressed: editor.isActive("textStyle", {
        fontFamily: '"Comic Sans MS", "Comic Sans"',
      }),
      id: "comic-sans",
    },
    {
      label: "Serif",
      onClick: () => editor.chain().focus().setFontFamily("serif").run(),
      pressed: editor.isActive("textStyle", { fontFamily: "serif" }),
      id: "serif",
    },
    {
      label: "Monospace",
      onClick: () => editor.chain().focus().setFontFamily("monospace").run(),
      pressed: editor.isActive("textStyle", { fontFamily: "monospace" }),
      id: "monospace",
    },
    {
      label: "Cursive",
      onClick: () => editor.chain().focus().setFontFamily("cursive").run(),
      pressed: editor.isActive("textStyle", { fontFamily: "cursive" }),
      id: "cursive",
    },
    {
      label: "Exo2",
      onClick: () => editor.chain().focus().setFontFamily("Exo 2").run(),
      pressed: editor.isActive("textStyle", { fontFamily: "Exo 2" }),
      id: "exo2",
    },
  ];

  const fontcolor = [
    {
      label: "Purple",
      color: "#958DF1",
      onClick: () => editor.chain().focus().setColor("#958DF1").run(),
      pressed: editor.isActive("textStyle", { color: "#958DF1" }),
    },
    {
      label: "Red",
      color: "#F98181",
      onClick: () => editor.chain().focus().setColor("#F98181").run(),
      pressed: editor.isActive("textStyle", { color: "#F98181" }),
    },
    {
      label: "Yellow",
      color: "#FAF594",
      onClick: () => editor.chain().focus().setColor("#FAF594").run(),
      pressed: editor.isActive("textStyle", { color: "#FAF594" }),
    },
    {
      label: "Blue",
      color: "#70CFF8",
      onClick: () => editor.chain().focus().setColor("#70CFF8").run(),
      pressed: editor.isActive("textStyle", { color: "#70CFF8" }),
    },
    {
      label: "Black",
      color: "#000000",
      onClick: () => editor.chain().focus().setColor("#000000").run(),
      pressed: editor.isActive("textStyle", { color: "#000000" }),
    },
    {
      label: "Green",
      color: "#8BC34A",
      onClick: () => editor.chain().focus().setColor("#8BC34A").run(),
      pressed: editor.isActive("textStyle", { color: "#8BC34A" }),
    },
    {
      label: "Orange",
      color: "#FF9800",
      onClick: () => editor.chain().focus().setColor("#FF9800").run(),
      pressed: editor.isActive("textStyle", { color: "#FF9800" }),
    },
    {
      label: "Pink",
      color: "#E91E63",
      onClick: () => editor.chain().focus().setColor("#E91E63").run(),
      pressed: editor.isActive("textStyle", { color: "#E91E63" }),
    },
    {
      label: "Teal",
      color: "#009688",
      onClick: () => editor.chain().focus().setColor("#009688").run(),
      pressed: editor.isActive("textStyle", { color: "#009688" }),
    },
    {
      label: "Brown",
      color: "#795548",
      onClick: () => editor.chain().focus().setColor("#795548").run(),
      pressed: editor.isActive("textStyle", { color: "#795548" }),
    },
    {
      label: "Gray",
      color: "#9E9E9E",
      onClick: () => editor.chain().focus().setColor("#9E9E9E").run(),
      pressed: editor.isActive("textStyle", { color: "#9E9E9E" }),
    },
    {
      label: "Light Blue",
      color: "#03A9F4",
      onClick: () => editor.chain().focus().setColor("#03A9F4").run(),
      pressed: editor.isActive("textStyle", { color: "#03A9F4" }),
    },
    {
      label: "Dark Red",
      color: "#B71C1C",
      onClick: () => editor.chain().focus().setColor("#B71C1C").run(),
      pressed: editor.isActive("textStyle", { color: "#B71C1C" }),
    },
  ];


  return (
    <div className="border rounded-md p-1.5 mb-1 bg-slate-50 space-x-1 sticky top-10 z-50 flex items-center  flex-wrap">
      <select
        className="w-40 p-2 border rounded-md"
        onChange={(e) => {
          const selectedFont = familyfont.find(
            (font) => font.label === e.target.value
          );
          if (selectedFont) {
            selectedFont.onClick();
          }
        }}
      >
        {familyfont.map((option, index) => (
          <option key={index} value={option.label} selected={option.pressed}>
            {option.label}
          </option>
        ))}
      </select>

      {Options.map((option, index) => (
        <Toggle
          key={index}
          size="sm"
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}

      <div
        className="hover:bg-slate-200 p-1 px-2 mt-1 rounded-md"
        onClick={() => {
          setcoloropen((current) => !current);
        }}
      >
        
        Text color
      </div>


      {coloropen && (
        <div className="bg-slate-100 w-full my-1">
          <div className="w-full p-1 text-center">TextColor</div>
          {fontcolor.map((option, index) => (
            <Toggle
              key={index}
              size="sm"
              pressed={option.pressed}
              onPressedChange={option.onClick}
              onClick={() => {
                setcoloropen(false);
              }}
            >
              <div
                style={{ backgroundColor: option.color }}
                className="h-4 w-4 rounded-full"
              ></div>
              {option.label}
            </Toggle>
          ))}
        </div>
      )}


    </div>
  );
}
