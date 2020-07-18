# TypeScript + Vue.js + FirebaseでつくるTrello風メモアプリ『My Memo Board』

## デモ
<img src="https://user-images.githubusercontent.com/59694183/83400616-1ece8500-a43e-11ea-9c18-a6e440b6f4f9.gif" width="500">
<br>
<br>

[こちら](https://draggable-memo-app-foolish-pine.netlify.app/)からお使いいただけます。
<br>
<br>
「匿名でログイン」をクリックすることで、Googleアカウントの認証なしで利用することもできます。その場合、カードやメモはブラウザを閉じたりリロードしたりしても保持されますが、ログアウトすると失われます。
<br>
<br>

## ポイント
- TypeScript + Vue.js + Firebaseで作成した認証機能つきメモアプリです。
- カードとメモを新規作成、削除、編集することができます。
- ドラッグ＆ドロップでカードとメモを移動させることができます。
- メモは別のカードに移動させることもできます。
- ヘッダー右上の「…」からテーマカラーを設定できます。
<br>

## 制作者コメント
ドラッグ&ドロップでのコンテンツの移動はドラッグ&ドロップライブラリ『Vue.Draggable』のおかげですぐ実装できたものの、カードとメモの並び順をどのような形でFirestoreに保存すればよいのか悩みました…。結局、各カードをひとつのドキュメントとし、そのフィールドにカードのインデックスとメモを格納する配列を持たせることにしました。Firebaseをいろいろいじってみて、データベースの勉強が足りないと痛感した次第です。<br>
<br>

2020.7.17 追記<br>
JavaScriptからTypeScriptに改修しました。TS + Vuexのベストな書き方がよくわからずかなり迷走しましたが、なんとかできました。
<br>
<br>

## 制作に使用した言語・ツール
TypeScript / Vue.js / Firebase / Vuetify
<br>
<br>

## 制作時間
50時間
<br>
<br>


