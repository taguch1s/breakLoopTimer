#!/bin/bash

# 休憩ループタイマーのセットアップスクリプト

echo "🚀 休憩ループタイマーのセットアップ"
echo ""

# アイコンファイルの生成
echo "📦 アイコンファイルを生成しています..."

# ImageMagickがインストールされているか確認
if command -v convert &> /dev/null; then
    echo "✅ ImageMagickが見つかりました"

    # 128x128のアイコンを生成
    convert -size 128x128 xc:'#667eea' -gravity center \
            -pointsize 80 -fill white \
            -font 'DejaVu-Sans' -annotate +0+0 '⏰' \
            icons/icon128.png

    # 48x48のアイコンを生成
    convert icons/icon128.png -resize 48x48 icons/icon48.png

    # 16x16のアイコンを生成
    convert icons/icon128.png -resize 16x16 icons/icon16.png

    echo "✅ アイコンファイルを生成しました"
elif command -v inkscape &> /dev/null; then
    echo "✅ Inkscapeが見つかりました"

    # SVGからPNGを生成
    inkscape icons/icon-template.svg --export-filename=icons/icon128.png --export-width=128 --export-height=128
    inkscape icons/icon-template.svg --export-filename=icons/icon48.png --export-width=48 --export-height=48
    inkscape icons/icon-template.svg --export-filename=icons/icon16.png --export-width=16 --export-height=16

    echo "✅ アイコンファイルを生成しました"
else
    echo "⚠️  ImageMagickまたはInkscapeがインストールされていません"
    echo ""
    echo "以下のいずれかをインストールしてください："
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  または: sudo apt-get install inkscape"
    echo "  macOS: brew install imagemagick"
    echo "  または: brew install inkscape"
    echo ""
    echo "または、icons/フォルダに手動でアイコンファイルを配置してください："
    echo "  - icon16.png (16x16px)"
    echo "  - icon48.png (48x48px)"
    echo "  - icon128.png (128x128px)"
    echo ""
    echo "アイコンなしでも拡張機能は動作しますが、警告が表示されます。"
fi

echo ""
echo "📋 次のステップ："
echo "1. Chromeで chrome://extensions/ を開く"
echo "2. 右上の「デベロッパーモード」をONにする"
echo "3. 「パッケージ化されていない拡張機能を読み込む」をクリック"
echo "4. このフォルダ（breakLoopTimer）を選択"
echo ""
echo "✨ セットアップ完了！"
