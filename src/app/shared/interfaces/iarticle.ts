export interface IArticle {
  id: number;
  title: string;
  content: string;
}

export interface IUpdateArticle extends Omit<IArticle, 'id'> {}
export interface ICreateArticle extends Omit<IArticle, 'id'> {
  userId: number;
}
