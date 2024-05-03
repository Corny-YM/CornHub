import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Sad = ({ className }: Props) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={cn("w-full h-full", className)}
    >
      <g clipPath="url(#clip0_15251_63610)">
        <path
          d="M15.9943 8.0004c0 4.4181-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5815-7.9996-7.9996 0-4.418 3.5816-7.9995 7.9996-7.9995 4.4181 0 7.9996 3.5815 7.9996 7.9995Z"
          fill="url(#paint0_linear_15251_63610)"
        />
        <path
          d="M15.9973 7.9992c0 4.4178-3.5811 7.9992-7.9987 7.9992C3.5811 15.9984 0 12.417 0 7.9992S3.5811 0 7.9986 0c4.4176 0 7.9987 3.5814 7.9987 7.9992Z"
          fill="url(#paint1_radial_15251_63610)"
        />
        <path
          d="M15.9943 8.0004c0 4.4181-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5815-7.9996-7.9996 0-4.418 3.5816-7.9995 7.9996-7.9995 4.4181 0 7.9996 3.5815 7.9996 7.9995Z"
          fill="url(#paint2_radial_15251_63610)"
          fillOpacity=".8"
        />
        <path
          d="M12.3964 9.0861c0 1.1142-.3999 1.1142-1.1999 1.1142-.7999 0-1.2 0-1.2-1.1142 0-.8205.5373-1.4856 1.2-1.4856s1.1999.6651 1.1999 1.4856ZM5.9965 9.0861c0 1.1142-.4 1.1142-1.1999 1.1142-.8 0-1.2 0-1.2-1.1142 0-.8205.5373-1.4856 1.2-1.4856s1.2.6651 1.2 1.4856Z"
          fill="#1C1C1D"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.9946 11.2002c1.6447 0 2.3999 1.0936 2.3999 1.4122 0 .1095-.084.1877-.2248.1877-.3152 0-.752-.4-2.1751-.4s-1.8599.4-2.175.4c-.1409 0-.2249-.0782-.2249-.1877 0-.3186.7552-1.4122 2.3999-1.4122Z"
          fill="#4B280E"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.7861 6.3078a3.3942 3.3942 0 0 1 1.8777 1.0409.4.4 0 0 0 .5892-.5411 4.1944 4.1944 0 0 0-2.3202-1.2862.4.4 0 1 0-.1467.7864ZM5.206 6.3078a3.3946 3.3946 0 0 0-1.8777 1.0409.4.4 0 1 1-.5891-.5411 4.1946 4.1946 0 0 1 2.3202-1.2862.4.4 0 0 1 .1467.7864Z"
          fill="#E0761A"
        />
        <g filter="url(#filter0_i_15251_63610)">
          <path
            d="M2.9952 11.2004c-.2647-.003-.435.1598-1.1536 1.3088-.3267.5231-.6468 1.0515-.6468 1.691 0 .994.8 1.7999 1.8 1.7999.9999 0 1.8008-.8 1.8008-1.7999 0-.6395-.32-1.1679-.6468-1.691-.7186-1.149-.8887-1.3118-1.1536-1.3088Z"
            fill="#02ADFC"
            fillOpacity=".9"
          />
        </g>
      </g>
      <defs>
        <radialGradient
          id="paint1_radial_15251_63610"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 7.9992 -7.99863 0 7.9986 7.9992)"
        >
          <stop offset=".5637" stopColor="#FF5758" stopOpacity="0" />
          <stop offset="1" stopColor="#FF5758" stopOpacity=".1" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_15251_63610"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(45 -4.5287 10.9195) scale(10.1818)"
        >
          <stop stopColor="#FFF287" />
          <stop offset="1" stopColor="#FFF287" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="paint0_linear_15251_63610"
          x1="2.395"
          y1="2.4007"
          x2="13.5944"
          y2="13.6001"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF287" />
          <stop offset="1" stopColor="#F68628" />
        </linearGradient>
        <clipPath id="clip0_15251_63610">
          <path fill="#fff" d="M-.003.0009h15.9993v15.9984H-.003z" />
        </clipPath>
        <filter
          id="filter0_i_15251_63610"
          x="1.1948"
          y="11.2003"
          width="3.6006"
          height="4.7998"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.1999" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 0.278431 0 0 0 0 0.196078 0 0 0 0 0.952941 0 0 0 0.1 0" />
          <feBlend in2="shape" result="effect1_innerShadow_15251_63610" />
        </filter>
      </defs>
    </svg>
  );
};

export default Sad;
