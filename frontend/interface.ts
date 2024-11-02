export interface IPost {
  _id: string;
  id: string;
  title: string;
  body: string;
  authorId: IUser;
  categoryId: string;
  excerpt: string;
  coverImage: string;
  liked: number;
  createdAt: string;
  author: string;
  date: string;
}

export interface IRole {
  id: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  roleId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  description: string;
}

export interface IComment {
  _id: string;
  comment: string;
  commenterId: IUser;
  createdAt: string;
  postId: string;
}
