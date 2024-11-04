export interface IDecodedToken {
  userId: string;
  exp: number;
  iat: number;
}
export interface IPost {
  _id: string;
  title: string;
  body: string;
  authorId: IUser;
  categoryId: ICategory;
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
  _id: string;
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

export interface ITestimonial {
  id: string;
  name: string;
  role: string;
  message: string;
}
