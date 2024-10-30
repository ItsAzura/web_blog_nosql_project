export interface IAuthor {
  _id: string;
  username: string;
}

export interface IPost {
  _id: string;
  id: string;
  title: string;
  body: string;
  authorId: IAuthor;
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
