#!/bin/bash

# Chrome Web Store提出用のzipファイルを作成

# 出力ファイル名（バージョン番号を含める）
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
OUTPUT="break-loop-timer-v${VERSION}.zip"

echo "Creating release zip: ${OUTPUT}"

# 一時ディレクトリを作成
TEMP_DIR=$(mktemp -d)
BUILD_DIR="${TEMP_DIR}/break-loop-timer"
mkdir -p "${BUILD_DIR}"

# 必要なファイルをコピー
echo "Copying extension files..."
cp manifest.json "${BUILD_DIR}/"
cp background.js "${BUILD_DIR}/"
cp content.js "${BUILD_DIR}/"
cp content.css "${BUILD_DIR}/"
cp options.html "${BUILD_DIR}/"
cp options.js "${BUILD_DIR}/"
cp popup.html "${BUILD_DIR}/"
cp popup.js "${BUILD_DIR}/"

# アイコンディレクトリをコピー（pngファイルのみ）
echo "Copying icons..."
mkdir -p "${BUILD_DIR}/icons"
cp icons/*.png "${BUILD_DIR}/icons/"

# zipファイルを作成
echo "Creating zip file..."
cd "${BUILD_DIR}"
zip -r "${OUTPUT}" ./*
mv "${OUTPUT}" "${OLDPWD}/"

# 一時ディレクトリを削除
cd "${OLDPWD}"
rm -rf "${TEMP_DIR}"

echo "✓ Created: ${OUTPUT}"
echo ""
echo "File list:"
unzip -l "${OUTPUT}"
