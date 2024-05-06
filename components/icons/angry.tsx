import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Angry = ({ className }: Props) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={cn("w-full h-full", className)}
    >
      <g clipPath="url(#angry1)">
        <path
          d="M15.9972 7.9996c0 4.418-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5816-7.9996-7.9996S3.5796 0 7.9976 0c4.4181 0 7.9996 3.5815 7.9996 7.9996Z"
          fill="url(#angry2)"
        />
        <path
          d="M15.9973 7.9992c0 4.4178-3.5811 7.9992-7.9987 7.9992C3.5811 15.9984 0 12.417 0 7.9992S3.5811 0 7.9986 0c4.4176 0 7.9987 3.5814 7.9987 7.9992Z"
          fill="url(#angry3)"
        />
        <path
          d="M15.9972 7.9996c0 4.418-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5816-7.9996-7.9996S3.5796 0 7.9976 0c4.4181 0 7.9996 3.5815 7.9996 7.9996Z"
          fill="url(#angry4)"
          fillOpacity=".8"
        />
        <path
          d="M12.3955 9.0853c0 1.1142-.4 1.1142-1.2 1.1142-.7999 0-1.1999 0-1.1999-1.1143 0-.8205.5372-1.4856 1.1999-1.4856s1.2.6651 1.2 1.4857ZM5.9956 9.0853c0 1.1142-.4 1.1142-1.2 1.1142-.8 0-1.1999 0-1.1999-1.1143 0-.8205.5372-1.4856 1.2-1.4856.6626 0 1.1999.6651 1.1999 1.4857Z"
          fill="#1C1C1D"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.9936 11.5994c1.3257 0 2.3999.292 2.3999.8023 0 .4234-1.0742.3973-2.3999.3973-1.3256 0-2.3998.0261-2.3998-.3973 0-.5103 1.0742-.8023 2.3998-.8023Z"
          fill="#4B280E"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.3283 7.0331a.4.4 0 0 0-.5444-.1535c-.4415.2472-1.0866.4228-1.7434.5373-.6488.1132-1.2697.1604-1.6367.1691a.4.4 0 1 0 .0191.7997c.4037-.0096 1.0643-.0602 1.755-.1807.6828-.119 1.4354-.313 1.9969-.6275a.4.4 0 0 0 .1535-.5444ZM2.491 7.0331a.4.4 0 0 1 .5444-.1535c.4416.2472 1.0866.4228 1.7434.5373.6488.1132 1.2697.1604 1.6367.1691a.4.4 0 1 1-.019.7997c-.4038-.0096-1.0643-.0602-1.7551-.1807-.6827-.119-1.4353-.313-1.9968-.6275a.4.4 0 0 1-.1536-.5444Z"
          fill="#BC0A26"
        />
      </g>
      <defs>
        <radialGradient
          id="angry3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 7.9992 -7.99863 0 7.9986 7.9992)"
        >
          <stop offset=".8134" stopColor="#FA2E3E" stopOpacity="0" />
          <stop offset="1" stopColor="#FA2E3E" stopOpacity=".1" />
        </radialGradient>
        <radialGradient
          id="angry4"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(45 -4.5272 10.9202) scale(10.1818)"
        >
          <stop stopColor="#FFB169" />
          <stop offset="1" stopColor="#FFB169" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="angry2"
          x1="2.396"
          y1="2.3999"
          x2="13.5954"
          y2="13.5993"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFB169" />
          <stop offset="1" stopColor="#FF5758" />
        </linearGradient>
        <clipPath id="angry1">
          <path fill="#fff" d="M-.004 0h15.9993v15.9992H-.004z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Angry;