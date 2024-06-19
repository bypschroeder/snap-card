export interface Card {
  id: number;
  userId: string;
  cardName: string;
  cardUrl: string;
  cardVisibility: "public" | "private";
  profileImageId: number | null;
  firstName: string | null;
  lastName: string | null;
  profession: { name: string }[] | null;
  socialMediaLinks?: { url: string }[] | null;
  bio: string | null;
  skills: { name: string }[] | null;
  email: string;
  phoneNumber: string;
  websiteUrl: string | null;
}
