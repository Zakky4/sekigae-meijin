# 席替え名人

## 概要

席替え名人は、簡単に席替えやグループ分けができるウェブアプリケーションです。参加者の情報を入力するだけで、バランスの取れた席替えを実現します。

## 主な機能

- 参加者名簿の入力（名前、性別、年齢層など）
- グループ数または1グループあたりの人数指定
- ランダム配席生成
- 条件付き配席（男女バランス、年齢層バランスなど）
- 結果の表示と出力

## 使い方

### 1. ホームページ

アプリケーションを開くとホームページが表示されます。ここでは、アプリケーションの概要と主な機能の説明があります。「席替えを始める」ボタンをクリックして、席替えプロセスを開始します。

### 2. 参加者情報の入力

このページでは、以下の手順で参加者情報を入力します：

1. 「参加者を追加」ボタンをクリックして、新しい参加者を追加します
2. 各参加者の以下の情報を入力します：
   - 名前：参加者の名前
   - 性別：「男性」「女性」「その他」から選択
   - 年齢層：「子ども」「10代」「20-60代」「70代以上」から選択
3. 必要に応じて「削除」ボタンをクリックして、参加者を削除できます
4. すべての参加者情報を入力したら、「次へ」ボタンをクリックします

### 3. 席替え設定

このページでは、グループ分けの設定を行います：

1. グループの指定方法を選択します：
   - グループ数を指定：総グループ数を設定
   - 1グループあたりの人数を指定：各グループの人数を設定
2. 選択した指定方法に応じて、グループ数または1グループあたりの人数を選択します
3. バランス条件を設定します：
   - 性別のバランスを考慮する：チェックするとグループ内の男女比をバランスさせます
   - 年齢層のバランスを考慮する：チェックするとグループ内の年齢層をバランスさせます
4. 「席替えを実行」ボタンをクリックして、グループ分けを実行します

### 4. 結果表示

このページでは、席替え結果が表示されます：

1. 各グループごとに参加者の情報（名前、性別、年齢層）が表示されます
2. グループをクリックすると選択状態になり、ハイライト表示されます
3. 「結果をコピー」ボタンをクリックすると、結果をテキスト形式でクリップボードにコピーできます
4. 「設定に戻る」ボタンで設定ページに戻ることができます
5. 「最初からやり直す」ボタンで最初からやり直すことができます

## 注意事項

- 参加者情報は一時的に保存されますが、ブラウザを閉じると消去されます
- 参加者が0人の場合は「次へ」ボタンが無効になります
- プルダウンメニューの表示が重なることがありますが、背景色が設定されているため選択肢は読み取れます

## 技術情報

このアプリケーションは以下の技術を使用しています：

- Next.js（App Router）
- TailwindCSS
- Zustand（状態管理）
- shadcn/ui（UIコンポーネント）

以上が席替え名人の操作方法です。簡単な操作で効率的なグループ分けができます。
