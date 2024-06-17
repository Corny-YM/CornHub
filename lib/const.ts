import { StatusGenderEnum, StatusRelationEnum } from "@/lib/enum";
import Wow from "@/components/icons/wow";
import Sad from "@/components/icons/sad";
import Love from "@/components/icons/love";
import Like from "@/components/icons/like";
import Heart from "@/components/icons/heart";
import Angry from "@/components/icons/angry";
import Smile from "@/components/icons/smile";

export const genderOptions = [
  { label: "---", value: "empty" },
  { label: "Nam", value: StatusGenderEnum.male },
  { label: "Nữ", value: StatusGenderEnum.female },
];

export const relationOptions = [
  { label: "---", value: "empty" },
  { label: "Độc thân", value: StatusRelationEnum.single },
  { label: "Hẹn hò", value: StatusRelationEnum.dating },
  { label: "Kết hôn", value: StatusRelationEnum.marriage },
];

export const emotions = [
  { label: "Thích", type: "like", color: "#0866ff", icon: Like },
  { label: "Yêu thích", type: "heart", color: "#f33e58", icon: Heart },
  { label: "Thương thương", type: "love", color: "#f7b125", icon: Love },
  { label: "Haha", type: "smile", color: "#f7b125", icon: Smile },
  { label: "Wow", type: "wow", color: "#f7b125", icon: Wow },
  { label: "Buồn", type: "sad", color: "#f7b125", icon: Sad },
  { label: "Phẫn nộ", type: "angry", color: "#e9710f", icon: Angry },
];

export const emotionIcons: Record<
  "like" | "heart" | "love" | "smile" | "wow" | "sad" | "angry",
  ({ className }: { className?: string }) => JSX.Element
> = {
  like: Like,
  heart: Heart,
  love: Love,
  smile: Smile,
  wow: Wow,
  sad: Sad,
  angry: Angry,
};
