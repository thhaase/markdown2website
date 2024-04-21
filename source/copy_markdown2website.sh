#!/bin/bash

SOURCE_DIR="~/Insync/thhaase.soz@gmail.com/GoogleDrive/markdown2website"

SOURCE_DIR=$(eval echo $SOURCE_DIR)

TARGET_DIR="."

mkdir -p "$TARGET_DIR"

cp -r "$SOURCE_DIR/source" "$TARGET_DIR"
cp -a "$SOURCE_DIR/index.html" "$TARGET_DIR"
cp -a "$SOURCE_DIR/startpage.md" "$TARGET_DIR"
mkdir media

echo "📁 setup complete ✨"

