# アイコンについて

この拡張機能には3種類のサイズのアイコンが必要です：

- icon16.png (16x16px)
- icon48.png (48x48px)
- icon128.png (128x128px)

## 一時的な解決策

アイコンファイルがない場合でも拡張機能は動作しますが、Chromeが警告を表示します。

## アイコンの作成方法

### オプション1: オンラインツールを使用

1. [Canva](https://www.canva.com/)や[Figma](https://www.figma.com/)などのデザインツールを使用
2. 128x128pxのキャンバスで時計やタイマーのアイコンをデザイン
3. PNG形式でエクスポート
4. [TinyPNG](https://tinypng.com/)などで16px、48px、128pxにリサイズ

### オプション2: 絵文字を使用（簡易版）

以下のコマンドでImageMagickを使用して簡易的なアイコンを作成できます：

```bash
# ImageMagickのインストール（Ubuntu/Debian）
sudo apt-get install imagemagick

# 絵文字からアイコンを生成
convert -size 128x128 xc:'#667eea' -gravity center -pointsize 80 -font 'DejaVu-Sans' -fill white -annotate +0+0 '⏰' icons/icon128.png
convert icons/icon128.png -resize 48x48 icons/icon48.png
convert icons/icon128.png -resize 16x16 icons/icon16.png
```

### オプション3: SVGから生成

icon-template.svgファイル（存在する場合）を編集して、以下のコマンドで変換：

```bash
# Inkscapeのインストール
sudo apt-get install inkscape

# SVGからPNGを生成
inkscape icon-template.svg --export-filename=icons/icon128.png --export-width=128 --export-height=128
inkscape icon-template.svg --export-filename=icons/icon48.png --export-width=48 --export-height=48
inkscape icon-template.svg --export-filename=icons/icon16.png --export-width=16 --export-height=16
```

## 推奨デザイン

- シンプルで認識しやすいデザイン
- 時計やタイマーを連想させるアイコン
- ブランドカラー: #667eea（紫）を使用
- 白または明るい色のシンボル
