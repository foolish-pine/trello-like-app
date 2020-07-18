import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";
import firebase from "firebase";
import { Cards } from "../modules/types";

@Module({ dynamic: true, store, name: "AppModule", namespaced: true })
class AppModule extends VuexModule {
  themeColor = "#FFFFFFFF"; // テーマカラー
  colors: { [s: string]: string } = {
    red: "#F4433654",
    purple: "#9C27B054",
    blue: "#2196F366",
    teal: "#00968866",
    green: "#4CAF5066",
    orange: "#FF980054",
    "blue-grey": "#607D8B66",
  }; // デフォルトのテーマカラーセット
  user: firebase.User | null = null; // ユーザー情報
  cards: Cards[] = [];

  get uid(): string {
    return this.user ? this.user.uid : "";
  }
  get displayName(): string | null {
    return this.user ? this.user.displayName : null;
  }
  get photoURL(): string | null {
    return this.user ? this.user.photoURL : null;
  }

  @Mutation
  setLoginUser(user: firebase.User) {
    this.user = user;
  }

  @Mutation
  doLogout() {
    this.user = null;
  }

  // stateのcardsをクリアする
  @Mutation
  clearCards() {
    this.cards = [];
  }

  @Mutation
  fetchCards({ id, index, cardName, memos }: Cards) {
    this.cards.push({ id, index, cardName, memos });
  }

  @Mutation
  setThemeColor(color: string) {
    this.themeColor = color;
  }

  // ログイン処理
  @Action
  doLoginAction() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  // 匿名ログイン
  @Action
  doAnonymousLoginAction() {
    firebase
      .auth()
      .signInAnonymously()
      .catch(() => {});
  }

  // ログアウト処理
  @Action
  doLogoutAction() {
    firebase.auth().signOut();
    this.doLogout();
  }

  // ユーザー情報のセット
  @Action
  setLoginUserAction(user: firebase.User) {
    this.setLoginUser(user);
    firebase
      .firestore()
      .collection("users")
      .doc(this.uid)
      .get()
      .then((doc) => {
        // 初めて利用するユーザーならusersにドキュメントを追加し、初期テーマカラーをセットする
        if (!doc.exists) {
          firebase
            .firestore()
            .collection("users")
            .doc(this.uid)
            .set({
              themeColor: "#00968866",
            })
            .then(() => {
              this.fetchThemeColorAction();
            });
        } else {
          // 既存ユーザーならテーマカラーを取得する
          this.fetchThemeColorAction();
        }
      });
    this.fetchCardsAction();
  }

  // ユーザーのカードを取得
  @Action
  fetchCardsAction() {
    firebase
      .firestore()
      .collection(`users/${this.user?.uid}/cards`)
      .orderBy("index", "asc")
      .onSnapshot(
        (snapshot) => {
          this.clearCards();
          snapshot.forEach((doc) => {
            this.fetchCards({
              id: doc.id,
              index: doc.get("index"),
              cardName: doc.get("cardName"),
              memos: doc.get("memos"),
            });
          });
        },
        () => {}
      );
  }

  // 設定したテーマカラーを取得する
  @Action
  fetchThemeColorAction() {
    firebase
      .firestore()
      .collection("users")
      .doc(this.uid)
      .get()
      .then((doc) => {
        this.setThemeColor(doc.data()!.themeColor);
      });
  }

  // 設定したテーマカラーをFirebaseに保存する
  @Action
  setThemeColorAction(color: string) {
    this.setThemeColor(color);
    firebase
      .firestore()
      .collection("users")
      .doc(`${this.uid}`)
      .update({ themeColor: color });
  }

  // カードを追加
  @Action
  addNewCardAction() {
    // 新しいカードのindex = 既存のカードのindexの最大値 + 1
    let cardIndexMax = 0;
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].index > cardIndexMax)
        cardIndexMax = this.cards[i].index;
    }
    const newCardIndex: number = Number(cardIndexMax) + 1;
    firebase
      .firestore()
      .collection(`users/${this.uid}/cards`)
      .doc()
      .set({ index: newCardIndex, cardName: "", memos: [] });
  }

  // カードを削除
  @Action
  deleteCardAction(cardId: string) {
    firebase
      .firestore()
      .collection(`users/${this.uid}/cards`)
      .doc(cardId)
      .delete();
  }

  // カード名を編集
  @Action
  editCardNameAction({ cardId, value }: { cardId: string; value: string }) {
    firebase
      .firestore()
      .collection(`users/${this.uid}/cards`)
      .doc(cardId)
      .update({
        cardName: value,
      });
  }

  // カード入れ替え時にカードのindexを更新する
  @Action
  updateCardOrderAction(event: any) {
    for (let i = 0; i < event.from.children.length; i++) {
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .doc(event.from.children[i].id)
        .update({ index: i });
    }
  }

  // メモを追加
  @Action
  addNewMemoAction({
    cardId,
    cardIndex,
  }: {
    cardId: string;
    cardIndex: number;
  }) {
    // カードのすべてのメモを取得し、配列に入れる
    const targetCardMemos: {
      value: string;
    }[] = Array.from(this.cards[cardIndex].memos);
    // その配列の最後にメモを追加する
    targetCardMemos.push({ value: "" });
    // メモ追加後の配列をfirebaseに保存
    firebase
      .firestore()
      .collection(`users/${this.uid}/cards`)
      .doc(cardId)
      .update({ memos: targetCardMemos });
  }

  // メモを削除
  @Action
  deleteMemoAction({
    cardId,
    cardIndex,
    memoIndex,
  }: {
    cardId: string;
    cardIndex: number;
    memoIndex: number;
  }) {
    const targetCardMemos: {
      value: string;
    }[] = Array.from(this.cards[cardIndex].memos);
    // その配列から、削除ボタンが押されたメモを削除する
    targetCardMemos.splice(memoIndex, 1);
    // メモ削除後の配列をfirebaseに保存
    firebase
      .firestore()
      .collection(`users/${this.uid}/cards`)
      .doc(cardId)
      .update({ memos: targetCardMemos });
  }

  // メモを編集
  @Action
  editMemoAction({
    cardId,
    cardIndex,
    memoIndex,
    value,
  }: {
    cardId: string;
    cardIndex: number;
    memoIndex: number;
    value: string;
  }) {
    const targetCardMemos: {
      value: string;
    }[] = Array.from(this.cards[cardIndex].memos);
    // 配列から編集したいメモを選択し、テキストエリアに入力した文字列をそのvalueに代入
    targetCardMemos[memoIndex].value = value;
    // メモ編集後の配列をfirebaseに保存
    firebase
      .firestore()
      .collection(`users/${this.uid}/cards`)
      .doc(cardId)
      .update({ memos: targetCardMemos });
  }

  // メモ移動後、移動元、移動先のメモ一覧をfirebaseに保存
  @Action
  updateMemoOrderAction(event: any) {
    // 移動元のカードのメモ一覧をfirebaseに保存
    const fromCardMemos: {
      value: string;
    }[] = this.cards[event.from.id].memos;
    firebase
      .firestore()
      .collection(`users/${this.uid}/cards`)
      .doc(this.cards[event.from.id].id)
      .update({ memos: fromCardMemos });
    // 移動先のカードのメモ一覧をfirebaseに保存
    const toCardMemos: {
      value: string;
    }[] = this.cards[event.to.id].memos;
    firebase
      .firestore()
      .collection(`users/${this.uid}/cards`)
      .doc(this.cards[event.to.id].id)
      .update({ memos: toCardMemos });
  }
}

export default getModule(AppModule);
