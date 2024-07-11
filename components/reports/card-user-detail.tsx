"use client";

import {
  Gem,
  Cake,
  Home,
  Heart,
  Earth,
  MapPin,
  CloudSun,
  CloudMoon,
  HandHeart,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";
import { useMemo } from "react";
import { UserDetail } from "@prisma/client";

import { formatDate } from "@/lib/utils";
import { StatusGenderEnum, StatusRelationEnum } from "@/lib/enum";
import { Separator } from "@/components/ui/separator";
import InfoDetailContent from "@/components/pages/account/about/info-detail-content";

interface Props {
  infoDetails: UserDetail;
}

const CardUserDetail = ({ infoDetails }: Props) => {
  // Gender
  const iconGender = useMemo(() => {
    // Gem | Heart | HandHeart
    const gender = infoDetails?.gender;
    if (gender === +StatusGenderEnum.male) return CloudSun;
    return CloudMoon;
  }, [infoDetails]);
  const labelGender = useMemo(() => {
    let label = infoDetails?.gender;
    if (label === +StatusGenderEnum.male) return "Nam";
    if (label === +StatusGenderEnum.male) return "Nữ";
    return "Không rõ";
  }, [infoDetails]);

  // Relation
  const iconRelation = useMemo(() => {
    // Gem | Heart | HandHeart
    const relationship = infoDetails?.relationship;
    if (relationship === StatusRelationEnum.marriage) return Gem;
    if (relationship === StatusRelationEnum.dating) return Heart;
    return HandHeart;
  }, [infoDetails]);
  const labelRelation = useMemo(() => {
    let label = infoDetails?.relationship;
    if (label === StatusRelationEnum.single) return "Độc thân";
    if (label === StatusRelationEnum.dating) return "Hẹn hò";
    if (label === StatusRelationEnum.marriage) return "Kết hôn";
    return null;
  }, [infoDetails]);

  const isShowBasicDetail = useMemo(() => {
    if (!infoDetails) return false;
    const { gender, birth } = infoDetails;
    if (!gender && !birth) return false;
    return true;
  }, [infoDetails]);

  return (
    <div className="flex-1 flex flex-col gap-y-2 px-4 mt-2">
      {isShowBasicDetail && (
        <>
          <div className="font-semibold text-lg">Thông tin cơ bản</div>

          {/* gender */}
          {!!infoDetails?.gender && (
            <InfoDetailContent
              icon={iconGender}
              label={
                <>
                  Giới tính <span className="font-semibold">{labelGender}</span>
                </>
              }
            />
          )}

          {/* birth */}
          {!!infoDetails?.birth && (
            <InfoDetailContent
              icon={Cake}
              label={
                <>
                  Ngày sinh{" "}
                  <span className="font-semibold">
                    {formatDate(infoDetails.birth, "/", false)}
                  </span>
                </>
              }
            />
          )}

          <Separator className="dark:bg-neutral-200/50 bg-neutral-400" />
        </>
      )}

      {/* work */}
      {!!infoDetails?.work && (
        <InfoDetailContent
          icon={BriefcaseBusiness}
          label={
            <>
              Làm việc tại{" "}
              <span className="font-semibold">{infoDetails.work}</span>
            </>
          }
        />
      )}

      {/* education */}
      {!!infoDetails?.education && (
        <InfoDetailContent
          icon={GraduationCap}
          label={
            <>
              Học tại{" "}
              <span className="font-semibold">{infoDetails.education}</span>
            </>
          }
        />
      )}

      {/* living */}
      {!!infoDetails?.living && (
        <InfoDetailContent
          icon={Home}
          label={
            <>
              Sống tại{" "}
              <span className="font-semibold">{infoDetails.living}</span>
            </>
          }
        />
      )}

      {/* country */}
      {!!infoDetails?.country && (
        <InfoDetailContent
          icon={MapPin}
          label={
            <>
              Đến từ{" "}
              <span className="font-semibold">{infoDetails.country}</span>
            </>
          }
        />
      )}

      {/* relationship */}
      {!!infoDetails?.relationship && (
        <InfoDetailContent icon={iconRelation} label={labelRelation} />
      )}

      {/* portfolio */}
      {!!infoDetails?.portfolio && (
        <InfoDetailContent link icon={Earth} label={infoDetails?.portfolio} />
      )}
    </div>
  );
};

export default CardUserDetail;
