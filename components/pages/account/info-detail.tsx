import {
  Gem,
  Home,
  Clock,
  Earth,
  Heart,
  MapPin,
  HandHeart,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";
import { useMemo } from "react";
import { UserDetail } from "@prisma/client";

import { formatDate } from "@/lib/utils";
import { StatusRelationEnum } from "@/lib/enum";
import { useAccountContext } from "@/providers/account-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InfoDetailContent from "./info-detail-content";

interface Props {}

const InfoDetail = ({}: Props) => {
  const { accountData, toggleModalEdit } = useAccountContext();

  const infoDetails = useMemo(() => {
    const result = accountData.userDetails?.[0] as UserDetail | undefined;
    return result;
  }, [accountData.userDetails]);

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

  return (
    <div className="sticky top-0" style={{ position: "-webkit-sticky" }}>
      <div className="w-full h-full flex flex-col p-4 rounded-lg dark:bg-neutral-800 bg-gray-100">
        <div className="font-semibold text-xl">Giới thiệu</div>
        {!!infoDetails?.biography && (
          <div className="pt-2 flex flex-col items-center">
            <div>{infoDetails.biography}</div>
            <Separator className="mt-2 w-full bg-primary/50" />
          </div>
        )}

        {/* Detail */}
        <div className="w-full pt-4">
          {!infoDetails && (
            <InfoDetailContent
              icon={Clock}
              label={
                <>
                  Tham gia CornHub vào{" "}
                  <span className="font-semibold">
                    {formatDate(accountData.created_at)}
                  </span>
                </>
              }
            />
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
            <InfoDetailContent
              link
              icon={Earth}
              label={infoDetails?.portfolio}
            />
          )}

          <Button
            className="w-full mt-2 hover:bg-primary/50"
            variant="outline"
            onClick={() => toggleModalEdit(true)}
          >
            Chỉnh sửa chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoDetail;
