"use client";

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
  CloudMoon,
  CloudSun,
  Cake,
} from "lucide-react";
import { useMemo } from "react";

import { formatDate } from "@/lib/utils";
import { StatusGenderEnum, StatusRelationEnum } from "@/lib/enum";
import { useAccountContext } from "@/providers/account-provider";
import { Button } from "@/components/ui/button";
import InfoDetailContent from "@/components/pages/account/about/info-detail-content";
import { Separator } from "@/components/ui/separator";

const UserAboutPage = () => {
  const { accountData } = useAccountContext();

  const { userDetails } = accountData;

  const infoDetails = useMemo(() => userDetails?.[0], []);

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
    <div className="mt-4 flex w-full pb-4 relative">
      <div className="w-full h-full flex flex-col p-4 rounded-lg dark:bg-neutral-800 bg-gray-100">
        <div className="font-semibold text-xl mb-4">Giới thiệu</div>

        <div className="w-full h-fit flex">
          <div className="w-1/4 flex flex-col">
            <Button
              className="w-full bg-primary/50 hover:bg-primary/50"
              variant="outline"
            >
              Tổng quan
            </Button>
          </div>

          <div className="flex-1 flex flex-col ml-4 px-4 border-l gap-y-2 border-solid border-gray-100/50">
            {isShowBasicDetail && (
              <>
                <div className="font-semibold text-lg">Thông tin cơ bản</div>

                {/* gender */}
                {!!infoDetails?.gender && (
                  <InfoDetailContent
                    icon={iconGender}
                    label={
                      <>
                        Giới tính{" "}
                        <span className="font-semibold">{labelGender}</span>
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
                    <span className="font-semibold">
                      {infoDetails.education}
                    </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAboutPage;
