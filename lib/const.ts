import Like from "@/components/icons/like";
import Heart from "@/components/icons/heart";
import Love from "@/components/icons/love";
import Smile from "@/components/icons/smile";
import Wow from "@/components/icons/wow";
import Sad from "@/components/icons/sad";
import Angry from "@/components/icons/angry";

export const emotions = [
  { label: "Thích", type: "like", color: "#0866ff", icon: Like },
  { label: "Yêu thích", type: "heart", color: "#f33e58", icon: Heart },
  { label: "Thương thương", type: "love", color: "#f7b125", icon: Love },
  { label: "Haha", type: "smile", color: "#f7b125", icon: Smile },
  { label: "Wow", type: "wow", color: "#f7b125", icon: Wow },
  { label: "Buồn", type: "sad", color: "#f7b125", icon: Sad },
  { label: "Phẫn nộ", type: "angry", color: "#e9710f", icon: Angry },
];

export const emotionIcons: Record<string, any> = {
  like: Like,
  heart: Heart,
  love: Love,
  smile: Smile,
  wow: Wow,
  sad: Sad,
  angry: Angry,
};
